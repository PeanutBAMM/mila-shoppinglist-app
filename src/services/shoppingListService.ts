import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { ShoppingList, ShoppingItem, CreateListInput, CreateItemInput } from '../types';

type DbShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
type DbShoppingItem = Database['public']['Tables']['shopping_items']['Row'];
type DbStore = Database['public']['Tables']['stores']['Row'];

export class ShoppingListService {
  /**
   * Get all shopping lists for the current user
   */
  static async getUserLists(): Promise<ShoppingList[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('shopping_lists')
      .select(`
        *,
        store:stores(*),
        items:shopping_items(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a single shopping list with all items
   */
  static async getList(listId: string): Promise<ShoppingList | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('shopping_lists')
      .select(`
        *,
        store:stores(*),
        items:shopping_items(*)
      `)
      .eq('id', listId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create a new shopping list
   */
  static async createList(input: CreateListInput): Promise<ShoppingList> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('shopping_lists')
      .insert({
        name: input.name,
        store_id: input.storeId,
        user_id: user.id,
        is_active: true
      })
      .select(`
        *,
        store:stores(*),
        items:shopping_items(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a shopping list
   */
  static async updateList(listId: string, updates: Partial<CreateListInput>): Promise<ShoppingList> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('shopping_lists')
      .update({
        name: updates.name,
        store_id: updates.storeId,
        is_active: updates.isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', listId)
      .eq('user_id', user.id)
      .select(`
        *,
        store:stores(*),
        items:shopping_items(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a shopping list
   */
  static async deleteList(listId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First delete all items in the list
    await supabase
      .from('shopping_items')
      .delete()
      .eq('list_id', listId);

    // Then delete the list
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', listId)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  /**
   * Add an item to a shopping list
   */
  static async addItem(listId: string, input: CreateItemInput): Promise<ShoppingItem> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Verify list ownership
    const list = await this.getList(listId);
    if (!list) throw new Error('List not found');

    // Get max position
    const { data: items } = await supabase
      .from('shopping_items')
      .select('position')
      .eq('list_id', listId)
      .order('position', { ascending: false })
      .limit(1);

    const maxPosition = items?.[0]?.position || 0;

    const { data, error } = await supabase
      .from('shopping_items')
      .insert({
        list_id: listId,
        name: input.name,
        quantity: input.quantity || 1,
        unit: input.unit,
        category: input.category,
        notes: input.notes,
        position: maxPosition + 1,
        is_checked: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update an item
   */
  static async updateItem(itemId: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem> {
    const { data, error } = await supabase
      .from('shopping_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Toggle item checked status
   */
  static async toggleItem(itemId: string): Promise<ShoppingItem> {
    // First get current state
    const { data: item } = await supabase
      .from('shopping_items')
      .select('is_checked')
      .eq('id', itemId)
      .single();

    if (!item) throw new Error('Item not found');

    // Toggle the state
    const { data, error } = await supabase
      .from('shopping_items')
      .update({
        is_checked: !item.is_checked,
        checked_at: !item.is_checked ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete an item
   */
  static async deleteItem(itemId: string): Promise<void> {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  }

  /**
   * Get all available stores
   */
  static async getStores(): Promise<DbStore[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  /**
   * Subscribe to real-time updates for a list
   */
  static subscribeToList(listId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`shopping-list-${listId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_items',
          filter: `list_id=eq.${listId}`
        },
        callback
      )
      .subscribe();
  }
}

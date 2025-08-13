import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useCredits = (user: User | null) => {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCredits();
    } else {
      setCredits(null);
    }
  }, [user]);

  const fetchCredits = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();
    
    if (data && !error) {
      setCredits(data.credits);
    }
    setLoading(false);
  };

  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    
    const { data, error } = await supabase.rpc('deduct_credits', {
      user_id_param: user.id,
      amount: amount
    });
    
    if (!error && data) {
      await fetchCredits(); // Refresh credits
      return true;
    }
    return false;
  };

  const addCredits = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    
    const { data, error } = await supabase.rpc('add_credits', {
      user_id_param: user.id,
      amount: amount
    });
    
    if (!error && data) {
      await fetchCredits(); // Refresh credits
      return true;
    }
    return false;
  };

  return {
    credits,
    loading,
    fetchCredits,
    deductCredits,
    addCredits
  };
};
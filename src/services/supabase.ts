import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, fullName?: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({
      password,
    });
  },

  getSession: async () => {
    return await supabase.auth.getSession();
  },

  getUser: async () => {
    return await supabase.auth.getUser();
  },
};

// Database helpers
export const db = {
  // Profile operations
  profiles: {
    get: async (userId: string) => {
      return await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
    },

    update: async (
      userId: string,
      updates: Partial<Database["public"]["Tables"]["profiles"]["Update"]>
    ) => {
      return await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();
    },
  },

  // List operations
  lists: {
    getAll: async () => {
      return await supabase
        .from("lists")
        .select("*")
        .order("position", { ascending: true });
    },

    create: async (list: Database["public"]["Tables"]["lists"]["Insert"]) => {
      return await supabase.from("lists").insert(list).select().single();
    },

    update: async (
      id: string,
      updates: Database["public"]["Tables"]["lists"]["Update"]
    ) => {
      return await supabase
        .from("lists")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
    },

    delete: async (id: string) => {
      return await supabase.from("lists").delete().eq("id", id);
    },
  },

  // Task operations
  tasks: {
    getByList: async (listId: string) => {
      return await supabase
        .from("tasks")
        .select("*")
        .eq("list_id", listId)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });
    },

    getAll: async () => {
      return await supabase
        .from("tasks")
        .select(
          `
          *,
          lists(name, color)
        `
        )
        .order("created_at", { ascending: false });
    },

    search: async (query: string) => {
      return await supabase
        .from("tasks")
        .select(
          `
          *,
          lists(name, color)
        `
        )
        .ilike("title", `%${query}%`)
        .order("created_at", { ascending: false });
    },

    create: async (task: Database["public"]["Tables"]["tasks"]["Insert"]) => {
      return await supabase.from("tasks").insert(task).select().single();
    },

    update: async (
      id: string,
      updates: Database["public"]["Tables"]["tasks"]["Update"]
    ) => {
      return await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
    },

    delete: async (id: string) => {
      return await supabase.from("tasks").delete().eq("id", id);
    },

    toggleComplete: async (id: string, completed: boolean) => {
      return await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", id)
        .select()
        .single();
    },
  },
};

// Real-time subscriptions
export const subscriptions = {
  lists: (callback: (payload: any) => void) => {
    return supabase
      .channel("lists_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lists",
        },
        callback
      )
      .subscribe();
  },

  tasks: (listId?: string, callback?: (payload: any) => void) => {
    const channel = supabase.channel("tasks_changes");

    if (listId && callback) {
      return channel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tasks",
            filter: `list_id=eq.${listId}`,
          },
          callback
        )
        .subscribe();
    }

    return channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        callback || (() => {})
      )
      .subscribe();
  },
};

export default supabase;

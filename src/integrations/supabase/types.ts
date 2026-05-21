export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      fiber_batches: {
        Row: {
          batch_code: string
          created_at: string | null
          grade: string | null
          grower_id: string | null
          harvest_date: string
          id: string
          micron_avg: number | null
          notes: string | null
          processing_status: string | null
          region: string | null
          weight_kg: number | null
        }
        Insert: {
          batch_code: string
          created_at?: string | null
          grade?: string | null
          grower_id?: string | null
          harvest_date: string
          id?: string
          micron_avg?: number | null
          notes?: string | null
          processing_status?: string | null
          region?: string | null
          weight_kg?: number | null
        }
        Update: {
          batch_code?: string
          created_at?: string | null
          grade?: string | null
          grower_id?: string | null
          harvest_date?: string
          id?: string
          micron_avg?: number | null
          notes?: string | null
          processing_status?: string | null
          region?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fiber_batches_grower_id_fkey"
            columns: ["grower_id"]
            isOneToOne: false
            referencedRelation: "growers"
            referencedColumns: ["id"]
          },
        ]
      }
      grower_transactions: {
        Row: {
          amount_nzd: number
          batch_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          grower_id: string
          id: string
          type: string | null
        }
        Insert: {
          amount_nzd: number
          batch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          grower_id: string
          id?: string
          type?: string | null
        }
        Update: {
          amount_nzd?: number
          batch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          grower_id?: string
          id?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grower_transactions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "fiber_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grower_transactions_grower_id_fkey"
            columns: ["grower_id"]
            isOneToOne: false
            referencedRelation: "growers"
            referencedColumns: ["id"]
          },
        ]
      }
      growers: {
        Row: {
          alpaca_count: number | null
          coordinates: unknown
          cover_image_url: string | null
          created_at: string | null
          credit_balance: number | null
          description: string | null
          farm_name: string
          id: string
          is_featured: boolean | null
          owner_name: string
          region: string
        }
        Insert: {
          alpaca_count?: number | null
          coordinates?: unknown
          cover_image_url?: string | null
          created_at?: string | null
          credit_balance?: number | null
          description?: string | null
          farm_name: string
          id?: string
          is_featured?: boolean | null
          owner_name: string
          region: string
        }
        Update: {
          alpaca_count?: number | null
          coordinates?: unknown
          cover_image_url?: string | null
          created_at?: string | null
          credit_balance?: number | null
          description?: string | null
          farm_name?: string
          id?: string
          is_featured?: boolean | null
          owner_name?: string
          region?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variant: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          total_price: number
          unit_price: number
          variant?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          currency: string | null
          customer_email: string
          customer_name: string | null
          discount: number | null
          discount_nzd: number | null
          exchange_rate: number | null
          id: string
          items: Json
          notes: string | null
          order_number: string
          payment_intent_id: string | null
          payment_method: string | null
          promo_code: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          shipping_email: string | null
          shipping_name: string | null
          shipping_nzd: number | null
          shipping_phone: string | null
          status: string | null
          subtotal: number | null
          subtotal_nzd: number | null
          total: number | null
          total_nzd: number | null
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          customer_email: string
          customer_name?: string | null
          discount?: number | null
          discount_nzd?: number | null
          exchange_rate?: number | null
          id?: string
          items: Json
          notes?: string | null
          order_number: string
          payment_intent_id?: string | null
          payment_method?: string | null
          promo_code?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_email?: string | null
          shipping_name?: string | null
          shipping_nzd?: number | null
          shipping_phone?: string | null
          status?: string | null
          subtotal?: number | null
          subtotal_nzd?: number | null
          total?: number | null
          total_nzd?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          customer_name?: string | null
          discount?: number | null
          discount_nzd?: number | null
          exchange_rate?: number | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          promo_code?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_email?: string | null
          shipping_name?: string | null
          shipping_nzd?: number | null
          shipping_phone?: string | null
          status?: string | null
          subtotal?: number | null
          subtotal_nzd?: number | null
          total?: number | null
          total_nzd?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          certifications: Json | null
          color_options: Json | null
          created_at: string | null
          description_en: string | null
          description_zh: string | null
          fabric_material: string | null
          fiber_batch_id: string | null
          fill_material: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          name_en: string
          name_zh: string
          price_nzd: number
          size_options: Json | null
          slug: string
          sort_order: number | null
          stock_quantity: number | null
          tier: string | null
          updated_at: string | null
          weight_grams: number | null
        }
        Insert: {
          category: string
          certifications?: Json | null
          color_options?: Json | null
          created_at?: string | null
          description_en?: string | null
          description_zh?: string | null
          fabric_material?: string | null
          fiber_batch_id?: string | null
          fill_material?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name_en: string
          name_zh: string
          price_nzd: number
          size_options?: Json | null
          slug: string
          sort_order?: number | null
          stock_quantity?: number | null
          tier?: string | null
          updated_at?: string | null
          weight_grams?: number | null
        }
        Update: {
          category?: string
          certifications?: Json | null
          color_options?: Json | null
          created_at?: string | null
          description_en?: string | null
          description_zh?: string | null
          fabric_material?: string | null
          fiber_batch_id?: string | null
          fill_material?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name_en?: string
          name_zh?: string
          price_nzd?: number
          size_options?: Json | null
          slug?: string
          sort_order?: number | null
          stock_quantity?: number | null
          tier?: string | null
          updated_at?: string | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_fiber_batch_id_fkey"
            columns: ["fiber_batch_id"]
            isOneToOne: false
            referencedRelation: "fiber_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          discount_type: string | null
          discount_value: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          min_order_nzd: number | null
          usage_limit: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_type?: string | null
          discount_value?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          min_order_nzd?: number | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_type?: string | null
          discount_value?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          min_order_nzd?: number | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      sleep_assessments: {
        Row: {
          answers: Json | null
          converted: boolean | null
          created_at: string | null
          id: string
          recommended_products: Json | null
          session_id: string | null
        }
        Insert: {
          answers?: Json | null
          converted?: boolean | null
          created_at?: string | null
          id?: string
          recommended_products?: Json | null
          session_id?: string | null
        }
        Update: {
          answers?: Json | null
          converted?: boolean | null
          created_at?: string | null
          id?: string
          recommended_products?: Json | null
          session_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

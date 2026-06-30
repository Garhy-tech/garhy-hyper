export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name_ar: string;
          name_en: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
          parent_id: string | null;
          description_ar: string | null;
          description_en: string | null;
          image_url: string | null;
          seo_title_ar: string | null;
          seo_title_en: string | null;
          seo_description_ar: string | null;
          seo_description_en: string | null;
          canonical_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_ar: string;
          name_en: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          parent_id?: string | null;
          description_ar?: string | null;
          description_en?: string | null;
          image_url?: string | null;
          seo_title_ar?: string | null;
          seo_title_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_en?: string | null;
          canonical_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_ar?: string;
          name_en?: string;
          display_order?: number;
          is_active?: boolean;
          parent_id?: string | null;
          description_ar?: string | null;
          description_en?: string | null;
          image_url?: string | null;
          seo_title_ar?: string | null;
          seo_title_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_en?: string | null;
          canonical_url?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      brands: {
        Row: {
          id: string;
          slug: string;
          name: string;
          logo_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          parent_id: string | null;
          name_ar: string | null;
          name_en: string | null;
          description_ar: string | null;
          description_en: string | null;
          country_id: string | null;
          seo_title_ar: string | null;
          seo_title_en: string | null;
          seo_description_ar: string | null;
          seo_description_en: string | null;
          canonical_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          logo_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          parent_id?: string | null;
          name_ar?: string | null;
          name_en?: string | null;
          description_ar?: string | null;
          description_en?: string | null;
          country_id?: string | null;
          seo_title_ar?: string | null;
          seo_title_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_en?: string | null;
          canonical_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          logo_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          parent_id?: string | null;
          name_ar?: string | null;
          name_en?: string | null;
          description_ar?: string | null;
          description_en?: string | null;
          country_id?: string | null;
          seo_title_ar?: string | null;
          seo_title_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_en?: string | null;
          canonical_url?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "brands_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "brands_country_id_fkey";
            columns: ["country_id"];
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          title_ar: string;
          title_en: string;
          description_ar: string | null;
          description_en: string | null;
          brand_name: string | null;
          brand_id: string | null;
          category_id: string | null;
          price: number;
          compare_at_price: number | null;
          image_url: string;
          gallery_urls: string[];
          rating: number;
          review_count: number;
          badge: "best-seller" | "trending" | "new" | "limited" | null;
          is_active: boolean;
          is_featured: boolean;
          is_best_seller: boolean;
          is_new_arrival: boolean;
          is_trending: boolean;
          is_recommended: boolean;
          free_shipping: boolean;
          fast_delivery: boolean;
          stock_quantity: number;
          status: Database["public"]["Enums"]["product_status"];
          factory_id: string | null;
          supplier_id: string | null;
          origin_country_id: string | null;
          eligible_retail: boolean;
          eligible_wholesale: boolean;
          eligible_distributor: boolean;
          eligible_factory_direct: boolean;
          slug_ar: string | null;
          slug_en: string | null;
          seo_title_ar: string | null;
          seo_title_en: string | null;
          seo_description_ar: string | null;
          seo_description_en: string | null;
          meta_keywords: string | null;
          canonical_url: string | null;
          search_vector: unknown | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_ar: string;
          title_en: string;
          description_ar?: string | null;
          description_en?: string | null;
          brand_name?: string | null;
          brand_id?: string | null;
          category_id?: string | null;
          price: number;
          compare_at_price?: number | null;
          image_url: string;
          gallery_urls?: string[];
          rating?: number;
          review_count?: number;
          badge?: "best-seller" | "trending" | "new" | "limited" | null;
          is_active?: boolean;
          is_featured?: boolean;
          is_best_seller?: boolean;
          is_new_arrival?: boolean;
          is_trending?: boolean;
          is_recommended?: boolean;
          free_shipping?: boolean;
          fast_delivery?: boolean;
          stock_quantity?: number;
          status?: Database["public"]["Enums"]["product_status"];
          factory_id?: string | null;
          supplier_id?: string | null;
          origin_country_id?: string | null;
          eligible_retail?: boolean;
          eligible_wholesale?: boolean;
          eligible_distributor?: boolean;
          eligible_factory_direct?: boolean;
          slug_ar?: string | null;
          slug_en?: string | null;
          seo_title_ar?: string | null;
          seo_title_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_en?: string | null;
          meta_keywords?: string | null;
          canonical_url?: string | null;
        };
        Update: {
          slug?: string;
          title_ar?: string;
          title_en?: string;
          price?: number;
          image_url?: string;
          is_active?: boolean;
          status?: Database["public"]["Enums"]["product_status"];
          factory_id?: string | null;
          supplier_id?: string | null;
          origin_country_id?: string | null;
          eligible_retail?: boolean;
          eligible_wholesale?: boolean;
          eligible_distributor?: boolean;
          eligible_factory_direct?: boolean;
          slug_ar?: string | null;
          slug_en?: string | null;
          seo_title_ar?: string | null;
          seo_title_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_en?: string | null;
          meta_keywords?: string | null;
          canonical_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey";
            columns: ["brand_id"];
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_factory_id_fkey";
            columns: ["factory_id"];
            referencedRelation: "factories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_supplier_id_fkey";
            columns: ["supplier_id"];
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_origin_country_id_fkey";
            columns: ["origin_country_id"];
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      flash_deals: {
        Row: {
          id: string;
          label_ar: string;
          label_en: string;
          hint_ar: string;
          hint_en: string;
          discount_pct: string;
          category_id: string | null;
          is_active: boolean;
          ends_at: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          label_ar: string;
          label_en: string;
          hint_ar: string;
          hint_en: string;
          discount_pct: string;
          category_id?: string | null;
          is_active?: boolean;
          ends_at?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          label_ar?: string;
          label_en?: string;
          discount_pct?: string;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "flash_deals_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      currencies: {
        Row: {
          code: string;
          name_ar: string;
          name_en: string;
          symbol: string;
          decimal_digits: number;
          rate_to_usd: number;
          is_active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          code: string;
          name_ar: string;
          name_en: string;
          symbol: string;
          decimal_digits?: number;
          rate_to_usd?: number;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          code?: string;
          name_ar?: string;
          name_en?: string;
          symbol?: string;
          decimal_digits?: number;
          rate_to_usd?: number;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      countries: {
        Row: {
          id: string;
          iso2: string;
          iso3: string | null;
          slug: string;
          name_ar: string;
          name_en: string;
          flag_emoji: string | null;
          dial_code: string | null;
          is_origin_region: boolean;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          iso2: string;
          iso3?: string | null;
          slug: string;
          name_ar: string;
          name_en: string;
          flag_emoji?: string | null;
          dial_code?: string | null;
          is_origin_region?: boolean;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          iso2?: string;
          iso3?: string | null;
          slug?: string;
          name_ar?: string;
          name_en?: string;
          flag_emoji?: string | null;
          dial_code?: string | null;
          is_origin_region?: boolean;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      factories: {
        Row: {
          id: string;
          slug: string;
          name_ar: string;
          name_en: string;
          parent_id: string | null;
          country_id: string | null;
          description_ar: string | null;
          description_en: string | null;
          logo_url: string | null;
          seo_title_ar: string | null;
          seo_title_en: string | null;
          seo_description_ar: string | null;
          seo_description_en: string | null;
          canonical_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_ar: string;
          name_en: string;
          parent_id?: string | null;
          country_id?: string | null;
          description_ar?: string | null;
          description_en?: string | null;
          logo_url?: string | null;
          seo_title_ar?: string | null;
          seo_title_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_en?: string | null;
          canonical_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_ar?: string;
          name_en?: string;
          parent_id?: string | null;
          country_id?: string | null;
          description_ar?: string | null;
          description_en?: string | null;
          logo_url?: string | null;
          seo_title_ar?: string | null;
          seo_title_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_en?: string | null;
          canonical_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "factories_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "factories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "factories_country_id_fkey";
            columns: ["country_id"];
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      suppliers: {
        Row: {
          id: string;
          slug: string;
          name_ar: string;
          name_en: string;
          parent_id: string | null;
          country_id: string | null;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          payment_terms: string | null;
          lead_time_days: number | null;
          notes: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_ar: string;
          name_en: string;
          parent_id?: string | null;
          country_id?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          payment_terms?: string | null;
          lead_time_days?: number | null;
          notes?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_ar?: string;
          name_en?: string;
          parent_id?: string | null;
          country_id?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          payment_terms?: string | null;
          lead_time_days?: number | null;
          notes?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "suppliers_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "suppliers_country_id_fkey";
            columns: ["country_id"];
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      distributors: {
        Row: {
          id: string;
          slug: string;
          name_ar: string;
          name_en: string;
          parent_id: string | null;
          country_id: string | null;
          territory: string | null;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          terms: string | null;
          notes: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_ar: string;
          name_en: string;
          parent_id?: string | null;
          country_id?: string | null;
          territory?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          terms?: string | null;
          notes?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_ar?: string;
          name_en?: string;
          parent_id?: string | null;
          country_id?: string | null;
          territory?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          terms?: string | null;
          notes?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "distributors_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "distributors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "distributors_country_id_fkey";
            columns: ["country_id"];
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string | null;
          barcode: string | null;
          title_ar: string | null;
          title_en: string | null;
          is_default: boolean;
          is_active: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku?: string | null;
          barcode?: string | null;
          title_ar?: string | null;
          title_en?: string | null;
          is_default?: boolean;
          is_active?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string | null;
          barcode?: string | null;
          title_ar?: string | null;
          title_en?: string | null;
          is_default?: boolean;
          is_active?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_options: {
        Row: {
          id: string;
          product_id: string;
          name_ar: string;
          name_en: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name_ar: string;
          name_en: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name_ar?: string;
          name_en?: string;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_option_values: {
        Row: {
          id: string;
          option_id: string;
          value_ar: string;
          value_en: string;
          swatch_hex: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          option_id: string;
          value_ar: string;
          value_en: string;
          swatch_hex?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          option_id?: string;
          value_ar?: string;
          value_en?: string;
          swatch_hex?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_option_values_option_id_fkey";
            columns: ["option_id"];
            referencedRelation: "product_options";
            referencedColumns: ["id"];
          },
        ];
      };
      variant_option_values: {
        Row: {
          variant_id: string;
          option_value_id: string;
        };
        Insert: {
          variant_id: string;
          option_value_id: string;
        };
        Update: {
          variant_id?: string;
          option_value_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "variant_option_values_variant_id_fkey";
            columns: ["variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "variant_option_values_option_value_id_fkey";
            columns: ["option_value_id"];
            referencedRelation: "product_option_values";
            referencedColumns: ["id"];
          },
        ];
      };
      attributes: {
        Row: {
          id: string;
          code: string;
          name_ar: string;
          name_en: string;
          data_type: Database["public"]["Enums"]["attribute_data_type"];
          unit: string | null;
          is_filterable: boolean;
          is_active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name_ar: string;
          name_en: string;
          data_type?: Database["public"]["Enums"]["attribute_data_type"];
          unit?: string | null;
          is_filterable?: boolean;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name_ar?: string;
          name_en?: string;
          data_type?: Database["public"]["Enums"]["attribute_data_type"];
          unit?: string | null;
          is_filterable?: boolean;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      product_attribute_values: {
        Row: {
          id: string;
          product_id: string;
          attribute_id: string;
          value_text: string | null;
          value_number: number | null;
          value_boolean: boolean | null;
          value_ar: string | null;
          value_en: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          attribute_id: string;
          value_text?: string | null;
          value_number?: number | null;
          value_boolean?: boolean | null;
          value_ar?: string | null;
          value_en?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          attribute_id?: string;
          value_text?: string | null;
          value_number?: number | null;
          value_boolean?: boolean | null;
          value_ar?: string | null;
          value_en?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_attribute_values_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_attribute_values_attribute_id_fkey";
            columns: ["attribute_id"];
            referencedRelation: "attributes";
            referencedColumns: ["id"];
          },
        ];
      };
      product_specs: {
        Row: {
          id: string;
          product_id: string;
          group_ar: string | null;
          group_en: string | null;
          label_ar: string;
          label_en: string;
          value_ar: string | null;
          value_en: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          group_ar?: string | null;
          group_en?: string | null;
          label_ar: string;
          label_en: string;
          value_ar?: string | null;
          value_en?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          group_ar?: string | null;
          group_en?: string | null;
          label_ar?: string;
          label_en?: string;
          value_ar?: string | null;
          value_en?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_specs_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_certifications: {
        Row: {
          id: string;
          product_id: string;
          name_ar: string;
          name_en: string;
          issuing_body: string | null;
          document_ref: string | null;
          document_url: string | null;
          issued_at: string | null;
          expires_at: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name_ar: string;
          name_en: string;
          issuing_body?: string | null;
          document_ref?: string | null;
          document_url?: string | null;
          issued_at?: string | null;
          expires_at?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name_ar?: string;
          name_en?: string;
          issuing_body?: string | null;
          document_ref?: string | null;
          document_url?: string | null;
          issued_at?: string | null;
          expires_at?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_certifications_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      price_lists: {
        Row: {
          id: string;
          code: string;
          name_ar: string;
          name_en: string;
          channel: Database["public"]["Enums"]["sales_channel"];
          currency_code: string;
          customer_segment: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name_ar: string;
          name_en: string;
          channel: Database["public"]["Enums"]["sales_channel"];
          currency_code: string;
          customer_segment?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name_ar?: string;
          name_en?: string;
          channel?: Database["public"]["Enums"]["sales_channel"];
          currency_code?: string;
          customer_segment?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "price_lists_currency_code_fkey";
            columns: ["currency_code"];
            referencedRelation: "currencies";
            referencedColumns: ["code"];
          },
        ];
      };
      product_prices: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          price_list_id: string;
          price: number;
          compare_at_price: number | null;
          min_order_qty: number;
          valid_from: string | null;
          valid_to: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          price_list_id: string;
          price: number;
          compare_at_price?: number | null;
          min_order_qty?: number;
          valid_from?: string | null;
          valid_to?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          price_list_id?: string;
          price?: number;
          compare_at_price?: number | null;
          min_order_qty?: number;
          valid_from?: string | null;
          valid_to?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_prices_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_prices_variant_id_fkey";
            columns: ["variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_prices_price_list_id_fkey";
            columns: ["price_list_id"];
            referencedRelation: "price_lists";
            referencedColumns: ["id"];
          },
        ];
      };
      price_tiers: {
        Row: {
          id: string;
          product_price_id: string;
          min_qty: number;
          max_qty: number | null;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_price_id: string;
          min_qty: number;
          max_qty?: number | null;
          unit_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_price_id?: string;
          min_qty?: number;
          max_qty?: number | null;
          unit_price?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "price_tiers_product_price_id_fkey";
            columns: ["product_price_id"];
            referencedRelation: "product_prices";
            referencedColumns: ["id"];
          },
        ];
      };
      warehouses: {
        Row: {
          id: string;
          code: string;
          name_ar: string;
          name_en: string;
          country_id: string | null;
          city: string | null;
          address: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name_ar: string;
          name_en: string;
          country_id?: string | null;
          city?: string | null;
          address?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name_ar?: string;
          name_en?: string;
          country_id?: string | null;
          city?: string | null;
          address?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "warehouses_country_id_fkey";
            columns: ["country_id"];
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      variant_inventory: {
        Row: {
          id: string;
          variant_id: string;
          warehouse_id: string;
          on_hand: number;
          reserved: number;
          available: number | null;
          reorder_point: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          variant_id: string;
          warehouse_id: string;
          on_hand?: number;
          reserved?: number;
          reorder_point?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          variant_id?: string;
          warehouse_id?: string;
          on_hand?: number;
          reserved?: number;
          reorder_point?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "variant_inventory_variant_id_fkey";
            columns: ["variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "variant_inventory_warehouse_id_fkey";
            columns: ["warehouse_id"];
            referencedRelation: "warehouses";
            referencedColumns: ["id"];
          },
        ];
      };
      variant_logistics: {
        Row: {
          variant_id: string;
          weight_grams: number | null;
          length_cm: number | null;
          width_cm: number | null;
          height_cm: number | null;
          package_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          variant_id: string;
          weight_grams?: number | null;
          length_cm?: number | null;
          width_cm?: number | null;
          height_cm?: number | null;
          package_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          variant_id?: string;
          weight_grams?: number | null;
          length_cm?: number | null;
          width_cm?: number | null;
          height_cm?: number | null;
          package_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "variant_logistics_variant_id_fkey";
            columns: ["variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      hs_codes: {
        Row: {
          code: string;
          description_ar: string | null;
          description_en: string | null;
          created_at: string;
        };
        Insert: {
          code: string;
          description_ar?: string | null;
          description_en?: string | null;
          created_at?: string;
        };
        Update: {
          code?: string;
          description_ar?: string | null;
          description_en?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      variant_customs: {
        Row: {
          variant_id: string;
          hs_code: string | null;
          country_of_origin_id: string | null;
          customs_value: number | null;
          import_duty_pct: number | null;
          export_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          variant_id: string;
          hs_code?: string | null;
          country_of_origin_id?: string | null;
          customs_value?: number | null;
          import_duty_pct?: number | null;
          export_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          variant_id?: string;
          hs_code?: string | null;
          country_of_origin_id?: string | null;
          customs_value?: number | null;
          import_duty_pct?: number | null;
          export_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "variant_customs_variant_id_fkey";
            columns: ["variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "variant_customs_hs_code_fkey";
            columns: ["hs_code"];
            referencedRelation: "hs_codes";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "variant_customs_country_of_origin_id_fkey";
            columns: ["country_of_origin_id"];
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      product_media: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          media_type: Database["public"]["Enums"]["media_type"];
          url: string;
          poster_url: string | null;
          provider: string | null;
          alt_ar: string | null;
          alt_en: string | null;
          display_order: number;
          is_primary: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          media_type?: Database["public"]["Enums"]["media_type"];
          url: string;
          poster_url?: string | null;
          provider?: string | null;
          alt_ar?: string | null;
          alt_en?: string | null;
          display_order?: number;
          is_primary?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          media_type?: Database["public"]["Enums"]["media_type"];
          url?: string;
          poster_url?: string | null;
          provider?: string | null;
          alt_ar?: string | null;
          alt_en?: string | null;
          display_order?: number;
          is_primary?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_media_variant_id_fkey";
            columns: ["variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      product_relationships: {
        Row: {
          id: string;
          source_product_id: string;
          target_product_id: string;
          relationship_type: Database["public"]["Enums"]["product_relationship_type"];
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_product_id: string;
          target_product_id: string;
          relationship_type: Database["public"]["Enums"]["product_relationship_type"];
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_product_id?: string;
          target_product_id?: string;
          relationship_type?: Database["public"]["Enums"]["product_relationship_type"];
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_relationships_source_product_id_fkey";
            columns: ["source_product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_relationships_target_product_id_fkey";
            columns: ["target_product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_bundles: {
        Row: {
          id: string;
          slug: string;
          name_ar: string;
          name_en: string;
          description_ar: string | null;
          description_en: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_ar: string;
          name_en: string;
          description_ar?: string | null;
          description_en?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_ar?: string;
          name_en?: string;
          description_ar?: string | null;
          description_en?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bundle_items: {
        Row: {
          id: string;
          bundle_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          bundle_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity?: number;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          bundle_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_id_fkey";
            columns: ["bundle_id"];
            referencedRelation: "product_bundles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bundle_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bundle_items_variant_id_fkey";
            columns: ["variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      recommendation_sets: {
        Row: {
          id: string;
          code: string;
          name_ar: string;
          name_en: string;
          algorithm: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name_ar: string;
          name_en: string;
          algorithm?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name_ar?: string;
          name_en?: string;
          algorithm?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      recommendation_items: {
        Row: {
          id: string;
          set_id: string;
          product_id: string;
          recommended_product_id: string;
          score: number;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          set_id: string;
          product_id: string;
          recommended_product_id: string;
          score?: number;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          set_id?: string;
          product_id?: string;
          recommended_product_id?: string;
          score?: number;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recommendation_items_set_id_fkey";
            columns: ["set_id"];
            referencedRelation: "recommendation_sets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recommendation_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recommendation_items_recommended_product_id_fkey";
            columns: ["recommended_product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_product_interactions: {
        Row: {
          id: string;
          session_id: string | null;
          user_id: string | null;
          product_id: string;
          variant_id: string | null;
          interaction_type: Database["public"]["Enums"]["interaction_type"];
          weight: number;
          metadata: Json;
          occurred_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          user_id?: string | null;
          product_id: string;
          variant_id?: string | null;
          interaction_type: Database["public"]["Enums"]["interaction_type"];
          weight?: number;
          metadata?: Json;
          occurred_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          user_id?: string | null;
          product_id?: string;
          variant_id?: string | null;
          interaction_type?: Database["public"]["Enums"]["interaction_type"];
          weight?: number;
          metadata?: Json;
          occurred_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_product_interactions_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      v_public_product_prices: {
        Row: {
          id: string | null;
          product_id: string | null;
          variant_id: string | null;
          price_list_id: string | null;
          currency_code: string | null;
          price: number | null;
          compare_at_price: number | null;
          min_order_qty: number | null;
          valid_from: string | null;
          valid_to: string | null;
        };
        Relationships: [];
      };
      v_public_price_tiers: {
        Row: {
          id: string | null;
          product_price_id: string | null;
          min_qty: number | null;
          max_qty: number | null;
          unit_price: number | null;
        };
        Relationships: [];
      };
      v_public_variant_availability: {
        Row: {
          variant_id: string | null;
          available_qty: number | null;
          in_stock: boolean | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user";
      product_status: "draft" | "active" | "archived";
      sales_channel: "retail" | "wholesale" | "distributor" | "factory_direct";
      attribute_data_type: "text" | "number" | "boolean" | "select";
      media_type: "image" | "video";
      product_relationship_type: "related" | "cross_sell" | "up_sell";
      interaction_type:
        | "view"
        | "click"
        | "add_to_cart"
        | "add_to_wishlist"
        | "purchase"
        | "search";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof DatabaseWithoutInternals, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;


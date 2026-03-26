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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          last_login: string | null
          password_hash: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          last_login?: string | null
          password_hash: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          last_login?: string | null
          password_hash?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_inbox: {
        Row: {
          content: string
          created_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          processed_at: string | null
          processed_case_study_id: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          processed_case_study_id?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          processed_case_study_id?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_inbox_processed_case_study_id_fkey"
            columns: ["processed_case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_registry: {
        Row: {
          confidence: number
          created_at: string
          first_task: string
          id: string
          last_task_queued_at: string | null
          metadata: Json
          mission: string
          name: string
          rationale: string | null
          source_cell_id: string | null
          status: Database["public"]["Enums"]["agent_registry_status"]
          suggested_skill: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          first_task: string
          id?: string
          last_task_queued_at?: string | null
          metadata?: Json
          mission: string
          name: string
          rationale?: string | null
          source_cell_id?: string | null
          status?: Database["public"]["Enums"]["agent_registry_status"]
          suggested_skill?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          first_task?: string
          id?: string
          last_task_queued_at?: string | null
          metadata?: Json
          mission?: string
          name?: string
          rationale?: string | null
          source_cell_id?: string | null
          status?: Database["public"]["Enums"]["agent_registry_status"]
          suggested_skill?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_registry_source_cell_id_fkey"
            columns: ["source_cell_id"]
            isOneToOne: false
            referencedRelation: "notebook_cells"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_registry_schedules: {
        Row: {
          agent_id: string
          cadence: Database["public"]["Enums"]["agent_cadence"]
          created_at: string
          id: string
          last_run_at: string | null
          metadata: Json
          next_run_at: string | null
          prompt_template: string | null
          run_day_of_month: number | null
          run_day_of_week: number | null
          run_hour_local: number
          run_minute_local: number
          status: Database["public"]["Enums"]["agent_schedule_status"]
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          cadence: Database["public"]["Enums"]["agent_cadence"]
          created_at?: string
          id?: string
          last_run_at?: string | null
          metadata?: Json
          next_run_at?: string | null
          prompt_template?: string | null
          run_day_of_month?: number | null
          run_day_of_week?: number | null
          run_hour_local?: number
          run_minute_local?: number
          status?: Database["public"]["Enums"]["agent_schedule_status"]
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          cadence?: Database["public"]["Enums"]["agent_cadence"]
          created_at?: string
          id?: string
          last_run_at?: string | null
          metadata?: Json
          next_run_at?: string | null
          prompt_template?: string | null
          run_day_of_month?: number | null
          run_day_of_week?: number | null
          run_hour_local?: number
          run_minute_local?: number
          status?: Database["public"]["Enums"]["agent_schedule_status"]
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_registry_schedules_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agent_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          action_items: Json | null
          admin_id: string | null
          conversation_type: string | null
          created_at: string | null
          id: string
          messages: Json
          profile_id: string
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          action_items?: Json | null
          admin_id?: string | null
          conversation_type?: string | null
          created_at?: string | null
          id?: string
          messages?: Json
          profile_id: string
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          action_items?: Json | null
          admin_id?: string | null
          conversation_type?: string | null
          created_at?: string | null
          id?: string
          messages?: Json
          profile_id?: string
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model_configurations: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          max_tokens: number | null
          model_name: string
          operation_type: string
          profile_id: string | null
          temperature: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_tokens?: number | null
          model_name?: string
          operation_type: string
          profile_id?: string | null
          temperature?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_tokens?: number | null
          model_name?: string
          operation_type?: string
          profile_id?: string | null
          temperature?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_configurations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          profile_id: string
          session_id: string | null
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          profile_id: string
          session_id?: string | null
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          profile_id?: string
          session_id?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bespoke_page_sections: {
        Row: {
          body_copy: string | null
          created_at: string
          cta_primary: string | null
          cta_secondary: string | null
          headline: string | null
          id: string
          media_type: string | null
          media_url: string | null
          order_index: number
          page_id: string
          section_key: string
          subheadline: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          body_copy?: string | null
          created_at?: string
          cta_primary?: string | null
          cta_secondary?: string | null
          headline?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          order_index?: number
          page_id: string
          section_key: string
          subheadline?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          body_copy?: string | null
          created_at?: string
          cta_primary?: string | null
          cta_secondary?: string | null
          headline?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          order_index?: number
          page_id?: string
          section_key?: string
          subheadline?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bespoke_page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "bespoke_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      bespoke_pages: {
        Row: {
          created_at: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_metrics: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          metric_name: string
          metric_value: string
          order_index: number | null
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          metric_name: string
          metric_value: string
          order_index?: number | null
          profile_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          metric_name?: string
          metric_value?: string
          order_index?: number | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_metrics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_posts: {
        Row: {
          asset_url: string | null
          campaign_id: string | null
          content: string | null
          created_at: string
          id: string
          platform: string
          status: string | null
          updated_at: string
          utm_code: string | null
        }
        Insert: {
          asset_url?: string | null
          campaign_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          platform: string
          status?: string | null
          updated_at?: string
          utm_code?: string | null
        }
        Update: {
          asset_url?: string | null
          campaign_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          platform?: string
          status?: string | null
          updated_at?: string
          utm_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_posts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campground_job_queue: {
        Row: {
          created_at: string | null
          created_by: string | null
          error: string | null
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          payload: Json | null
          processed_at: string | null
          prospect_id: string | null
          result: Json | null
          status: Database["public"]["Enums"]["job_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          error?: string | null
          id?: string
          job_type: Database["public"]["Enums"]["job_type"]
          payload?: Json | null
          processed_at?: string | null
          prospect_id?: string | null
          result?: Json | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          error?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          payload?: Json | null
          processed_at?: string | null
          prospect_id?: string | null
          result?: Json | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campground_job_queue_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "campground_prospects"
            referencedColumns: ["prospect_id"]
          },
        ]
      }
      campground_prospects: {
        Row: {
          calendly_event_uri: string | null
          call_scheduled_time: string | null
          company_name: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_title: string | null
          created_at: string | null
          created_by: string | null
          dossier_confidence: number | null
          dossier_doc_id: string | null
          employee_count: number | null
          gemini_brief: Json | null
          google_doc_url: string | null
          industry: string | null
          linkedin_url: string | null
          needs_manual_research: boolean | null
          notes: string | null
          outcome: string | null
          outcome_notes: string | null
          pre_call_email_content: string | null
          pre_call_email_opened: boolean | null
          pre_call_email_sent: boolean | null
          pre_call_email_sent_at: string | null
          projection_data: Json
          prospect_id: string
          selected_case_study_id: string | null
          session_id: string | null
          source: string | null
          stage: string
          status: string | null
          updated_at: string | null
          version: number | null
          website_url: string | null
          what_to_expect: string | null
        }
        Insert: {
          calendly_event_uri?: string | null
          call_scheduled_time?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          created_at?: string | null
          created_by?: string | null
          dossier_confidence?: number | null
          dossier_doc_id?: string | null
          employee_count?: number | null
          gemini_brief?: Json | null
          google_doc_url?: string | null
          industry?: string | null
          linkedin_url?: string | null
          needs_manual_research?: boolean | null
          notes?: string | null
          outcome?: string | null
          outcome_notes?: string | null
          pre_call_email_content?: string | null
          pre_call_email_opened?: boolean | null
          pre_call_email_sent?: boolean | null
          pre_call_email_sent_at?: string | null
          projection_data: Json
          prospect_id?: string
          selected_case_study_id?: string | null
          session_id?: string | null
          source?: string | null
          stage?: string
          status?: string | null
          updated_at?: string | null
          version?: number | null
          website_url?: string | null
          what_to_expect?: string | null
        }
        Update: {
          calendly_event_uri?: string | null
          call_scheduled_time?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          created_at?: string | null
          created_by?: string | null
          dossier_confidence?: number | null
          dossier_doc_id?: string | null
          employee_count?: number | null
          gemini_brief?: Json | null
          google_doc_url?: string | null
          industry?: string | null
          linkedin_url?: string | null
          needs_manual_research?: boolean | null
          notes?: string | null
          outcome?: string | null
          outcome_notes?: string | null
          pre_call_email_content?: string | null
          pre_call_email_opened?: boolean | null
          pre_call_email_sent?: boolean | null
          pre_call_email_sent_at?: string | null
          projection_data?: Json
          prospect_id?: string
          selected_case_study_id?: string | null
          session_id?: string | null
          source?: string | null
          stage?: string
          status?: string | null
          updated_at?: string | null
          version?: number | null
          website_url?: string | null
          what_to_expect?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campground_prospects_selected_case_study_id_fkey"
            columns: ["selected_case_study_id"]
            isOneToOne: false
            referencedRelation: "case_study_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      career_goals: {
        Row: {
          ai_recommendations: Json | null
          created_at: string | null
          description: string | null
          goal_title: string
          id: string
          profile_id: string
          progress_percentage: number | null
          status: string | null
          target_date: string | null
          updated_at: string | null
        }
        Insert: {
          ai_recommendations?: Json | null
          created_at?: string | null
          description?: string | null
          goal_title: string
          id?: string
          profile_id: string
          progress_percentage?: number | null
          status?: string | null
          target_date?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_recommendations?: Json | null
          created_at?: string | null
          description?: string | null
          goal_title?: string
          id?: string
          profile_id?: string
          progress_percentage?: number | null
          status?: string | null
          target_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "career_goals_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      career_updates: {
        Row: {
          ai_analyzed: boolean | null
          ai_suggestions: Json | null
          category: string
          content: string
          created_at: string | null
          id: string
          profile_id: string
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          ai_analyzed?: boolean | null
          ai_suggestions?: Json | null
          category: string
          content: string
          created_at?: string | null
          id?: string
          profile_id: string
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          ai_analyzed?: boolean | null
          ai_suggestions?: Json | null
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          profile_id?: string
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "career_updates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          analysis_data: Json
          audiences_data: Json
          card_data: Json
          created_at: string | null
          generated_images_data: Json
          id: string
          persona_tags: string[] | null
          prd_data: Json
          raw_idea: string
          social_posts_data: Json
          status: string
          type: string | null
          updated_at: string | null
          visual_concepts_data: Json
        }
        Insert: {
          analysis_data: Json
          audiences_data?: Json
          card_data: Json
          created_at?: string | null
          generated_images_data?: Json
          id?: string
          persona_tags?: string[] | null
          prd_data?: Json
          raw_idea: string
          social_posts_data?: Json
          status?: string
          type?: string | null
          updated_at?: string | null
          visual_concepts_data?: Json
        }
        Update: {
          analysis_data?: Json
          audiences_data?: Json
          card_data?: Json
          created_at?: string | null
          generated_images_data?: Json
          id?: string
          persona_tags?: string[] | null
          prd_data?: Json
          raw_idea?: string
          social_posts_data?: Json
          status?: string
          type?: string | null
          updated_at?: string | null
          visual_concepts_data?: Json
        }
        Relationships: []
      }
      case_study_detailed: {
        Row: {
          base_fee: number | null
          bomb_factory_duration_months: number | null
          bomb_factory_metrics: Json | null
          bomb_factory_problem: string
          bomb_factory_solution: string
          campground_duration_days: number | null
          campground_metrics: Json | null
          campground_problem: string
          campground_solution: string
          client_industry: string
          client_roi: number | null
          client_size: string | null
          created_at: string | null
          hero_image_url: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          order_index: number | null
          pattern_abstraction: string
          pattern_id: string | null
          performance_fee: number | null
          testimonial_author: string | null
          testimonial_quote: string | null
          testimonial_title: string | null
          total_fee: number | null
          updated_at: string | null
        }
        Insert: {
          base_fee?: number | null
          bomb_factory_duration_months?: number | null
          bomb_factory_metrics?: Json | null
          bomb_factory_problem: string
          bomb_factory_solution: string
          campground_duration_days?: number | null
          campground_metrics?: Json | null
          campground_problem: string
          campground_solution: string
          client_industry: string
          client_roi?: number | null
          client_size?: string | null
          created_at?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          pattern_abstraction: string
          pattern_id?: string | null
          performance_fee?: number | null
          testimonial_author?: string | null
          testimonial_quote?: string | null
          testimonial_title?: string | null
          total_fee?: number | null
          updated_at?: string | null
        }
        Update: {
          base_fee?: number | null
          bomb_factory_duration_months?: number | null
          bomb_factory_metrics?: Json | null
          bomb_factory_problem?: string
          bomb_factory_solution?: string
          campground_duration_days?: number | null
          campground_metrics?: Json | null
          campground_problem?: string
          campground_solution?: string
          client_industry?: string
          client_roi?: number | null
          client_size?: string | null
          created_at?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          pattern_abstraction?: string
          pattern_id?: string | null
          performance_fee?: number | null
          testimonial_author?: string | null
          testimonial_quote?: string | null
          testimonial_title?: string | null
          total_fee?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_study_detailed_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "pattern_library"
            referencedColumns: ["id"]
          },
        ]
      }
      case_study_engagement_ctas: {
        Row: {
          case_study_id: string
          cta_text: string
          engagement_rate: number | null
          generated_at: string | null
          id: string
          views: number | null
        }
        Insert: {
          case_study_id: string
          cta_text: string
          engagement_rate?: number | null
          generated_at?: string | null
          id?: string
          views?: number | null
        }
        Update: {
          case_study_id?: string
          cta_text?: string
          engagement_rate?: number | null
          generated_at?: string | null
          id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "case_study_engagement_ctas_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      case_study_views: {
        Row: {
          case_study_id: string
          id: string
          session_id: string | null
          viewed_at: string | null
          viewer_persona: string | null
        }
        Insert: {
          case_study_id: string
          id?: string
          session_id?: string | null
          viewed_at?: string | null
          viewer_persona?: string | null
        }
        Update: {
          case_study_id?: string
          id?: string
          session_id?: string | null
          viewed_at?: string | null
          viewer_persona?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_study_views_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      case_study_votes: {
        Row: {
          case_study_id: string
          created_at: string | null
          id: string
          metric_type: string
          session_id: string
          vote_direction: number
        }
        Insert: {
          case_study_id: string
          created_at?: string | null
          id?: string
          metric_type: string
          session_id: string
          vote_direction: number
        }
        Update: {
          case_study_id?: string
          created_at?: string | null
          id?: string
          metric_type?: string
          session_id?: string
          vote_direction?: number
        }
        Relationships: [
          {
            foreignKeyName: "case_study_votes_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          narrative_id: string
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          narrative_id: string
          order_index?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          narrative_id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_narrative_id_fkey"
            columns: ["narrative_id"]
            isOneToOne: false
            referencedRelation: "narratives"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          profile_id: string
          sender: string
          session_id: string
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          profile_id: string
          sender: string
          session_id: string
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          profile_id?: string
          sender?: string
          session_id?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conductor_config: {
        Row: {
          created_at: string
          default_quality_gate: number
          heartbeat_interval_minutes: number
          id: string
          is_active: boolean
          max_tasks_per_cycle: number
          pricing_flash_input_per_m: number
          pricing_flash_output_per_m: number
          pricing_pro_input_per_m: number
          pricing_pro_output_per_m: number
          settings: Json
          token_budget_per_cycle_usd: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          default_quality_gate?: number
          heartbeat_interval_minutes?: number
          id?: string
          is_active?: boolean
          max_tasks_per_cycle?: number
          pricing_flash_input_per_m?: number
          pricing_flash_output_per_m?: number
          pricing_pro_input_per_m?: number
          pricing_pro_output_per_m?: number
          settings?: Json
          token_budget_per_cycle_usd?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          default_quality_gate?: number
          heartbeat_interval_minutes?: number
          id?: string
          is_active?: boolean
          max_tasks_per_cycle?: number
          pricing_flash_input_per_m?: number
          pricing_flash_output_per_m?: number
          pricing_pro_input_per_m?: number
          pricing_pro_output_per_m?: number
          settings?: Json
          token_budget_per_cycle_usd?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      conductor_memory: {
        Row: {
          content: string
          created_at: string
          id: string
          last_recalled_at: string | null
          metadata: Json | null
          quality_score: number | null
          recall_count: number
          source_task_id: string | null
          tags: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          last_recalled_at?: string | null
          metadata?: Json | null
          quality_score?: number | null
          recall_count?: number
          source_task_id?: string | null
          tags?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          last_recalled_at?: string | null
          metadata?: Json | null
          quality_score?: number | null
          recall_count?: number
          source_task_id?: string | null
          tags?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conductor_memory_source_task_id_fkey"
            columns: ["source_task_id"]
            isOneToOne: false
            referencedRelation: "conductor_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      conductor_notifications: {
        Row: {
          action_url: string | null
          body: string
          created_at: string
          id: string
          metadata: Json | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["conductor_notification_type"]
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          body: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["conductor_notification_type"]
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          body?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["conductor_notification_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      conductor_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          depends_on: string[]
          duration_ms: number | null
          error_message: string | null
          id: string
          input_payload: Json
          input_tokens: number | null
          max_retries: number
          metadata: Json | null
          output_payload: Json | null
          output_tokens: number | null
          quality_notes: string | null
          quality_score: number | null
          retry_count: number
          source_ref: string | null
          source_type: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["conductor_task_status"]
          task_type: string
          token_cost_usd: number | null
          tool_name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          depends_on?: string[]
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_payload?: Json
          input_tokens?: number | null
          max_retries?: number
          metadata?: Json | null
          output_payload?: Json | null
          output_tokens?: number | null
          quality_notes?: string | null
          quality_score?: number | null
          retry_count?: number
          source_ref?: string | null
          source_type?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["conductor_task_status"]
          task_type: string
          token_cost_usd?: number | null
          tool_name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          depends_on?: string[]
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_payload?: Json
          input_tokens?: number | null
          max_retries?: number
          metadata?: Json | null
          output_payload?: Json | null
          output_tokens?: number | null
          quality_notes?: string | null
          quality_score?: number | null
          retry_count?: number
          source_ref?: string | null
          source_type?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["conductor_task_status"]
          task_type?: string
          token_cost_usd?: number | null
          tool_name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      content_suggestions: {
        Row: {
          applied_at: string | null
          created_at: string | null
          id: string
          original_content: Json | null
          profile_id: string
          reasoning: string
          status: string | null
          suggested_content: Json
          suggestion_type: string
          target_id: string | null
          target_table: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string | null
          id?: string
          original_content?: Json | null
          profile_id: string
          reasoning: string
          status?: string | null
          suggested_content: Json
          suggestion_type: string
          target_id?: string | null
          target_table: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string | null
          id?: string
          original_content?: Json | null
          profile_id?: string
          reasoning?: string
          status?: string | null
          suggested_content?: Json
          suggestion_type?: string
          target_id?: string | null
          target_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_suggestions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_tracking: {
        Row: {
          acts_viewed: number[] | null
          calculator_completed: boolean | null
          calculator_started: boolean | null
          campground_application_completed: boolean | null
          campground_application_started: boolean | null
          created_at: string | null
          cta_clicks: Json | null
          device_type: string | null
          direct_email_clicked: boolean | null
          id: string
          referral_source: string | null
          scroll_depth_max: number | null
          session_duration_seconds: number | null
          time_per_act: Json | null
          updated_at: string | null
          viewport_height: number | null
          viewport_width: number | null
          visitor_id: string
        }
        Insert: {
          acts_viewed?: number[] | null
          calculator_completed?: boolean | null
          calculator_started?: boolean | null
          campground_application_completed?: boolean | null
          campground_application_started?: boolean | null
          created_at?: string | null
          cta_clicks?: Json | null
          device_type?: string | null
          direct_email_clicked?: boolean | null
          id?: string
          referral_source?: string | null
          scroll_depth_max?: number | null
          session_duration_seconds?: number | null
          time_per_act?: Json | null
          updated_at?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
          visitor_id: string
        }
        Update: {
          acts_viewed?: number[] | null
          calculator_completed?: boolean | null
          calculator_started?: boolean | null
          campground_application_completed?: boolean | null
          campground_application_started?: boolean | null
          created_at?: string | null
          cta_clicks?: Json | null
          device_type?: string | null
          direct_email_clicked?: boolean | null
          id?: string
          referral_source?: string | null
          scroll_depth_max?: number | null
          session_duration_seconds?: number | null
          time_per_act?: Json | null
          updated_at?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
          visitor_id?: string
        }
        Relationships: []
      }
      daily_career_insights: {
        Row: {
          content: string
          created_at: string | null
          date: string | null
          id: string
          is_favorite: boolean | null
          profile_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          date?: string | null
          id?: string
          is_favorite?: boolean | null
          profile_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          date?: string | null
          id?: string
          is_favorite?: boolean | null
          profile_id?: string
        }
        Relationships: []
      }
      demo_catalog: {
        Row: {
          category: string | null
          cover_image_url: string | null
          cover_prompt: string | null
          created_at: string
          demo_video_url: string | null
          description: string | null
          featured: boolean
          github_repo: string | null
          id: string
          live_url: string | null
          pitch: string | null
          platform: string | null
          profile_id: string
          repo_url: string | null
          sort_order: number
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          cover_image_url?: string | null
          cover_prompt?: string | null
          created_at?: string
          demo_video_url?: string | null
          description?: string | null
          featured?: boolean
          github_repo?: string | null
          id?: string
          live_url?: string | null
          pitch?: string | null
          platform?: string | null
          profile_id?: string
          repo_url?: string | null
          sort_order?: number
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          cover_image_url?: string | null
          cover_prompt?: string | null
          created_at?: string
          demo_video_url?: string | null
          description?: string | null
          featured?: boolean
          github_repo?: string | null
          id?: string
          live_url?: string | null
          pitch?: string | null
          platform?: string | null
          profile_id?: string
          repo_url?: string | null
          sort_order?: number
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      demo_inquiries: {
        Row: {
          created_at: string | null
          demo_id: string
          email: string
          id: string
          message: string | null
          name: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          demo_id: string
          email: string
          id?: string
          message?: string | null
          name: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          demo_id?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_inquiries_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demo_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_reactions: {
        Row: {
          created_at: string | null
          demo_id: string
          id: string
          reaction: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          demo_id: string
          id?: string
          reaction: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          demo_id?: string
          id?: string
          reaction?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_reactions_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demo_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      ebitda_calculator_submissions: {
        Row: {
          annual_revenue: number | null
          created_at: string | null
          current_opex: number | null
          email_provided: string | null
          estimated_base_fee: number | null
          estimated_performance_fee: number | null
          estimated_roi: number | null
          estimated_total_fee: number | null
          id: string
          industry: string | null
          inefficiency_area: string | null
          matched_pattern_id: string | null
          next_action: string | null
          pattern_confidence: number | null
          pattern_match_confidence: string | null
          previous_attempts: string | null
          projected_ebitda_max: number | null
          projected_ebitda_min: number | null
          projected_opex_reduction_max: number | null
          projected_opex_reduction_min: number | null
          projected_savings_max: number | null
          projected_savings_min: number | null
          session_id: string | null
          success_criteria: string[] | null
          time_lost_level: string | null
        }
        Insert: {
          annual_revenue?: number | null
          created_at?: string | null
          current_opex?: number | null
          email_provided?: string | null
          estimated_base_fee?: number | null
          estimated_performance_fee?: number | null
          estimated_roi?: number | null
          estimated_total_fee?: number | null
          id?: string
          industry?: string | null
          inefficiency_area?: string | null
          matched_pattern_id?: string | null
          next_action?: string | null
          pattern_confidence?: number | null
          pattern_match_confidence?: string | null
          previous_attempts?: string | null
          projected_ebitda_max?: number | null
          projected_ebitda_min?: number | null
          projected_opex_reduction_max?: number | null
          projected_opex_reduction_min?: number | null
          projected_savings_max?: number | null
          projected_savings_min?: number | null
          session_id?: string | null
          success_criteria?: string[] | null
          time_lost_level?: string | null
        }
        Update: {
          annual_revenue?: number | null
          created_at?: string | null
          current_opex?: number | null
          email_provided?: string | null
          estimated_base_fee?: number | null
          estimated_performance_fee?: number | null
          estimated_roi?: number | null
          estimated_total_fee?: number | null
          id?: string
          industry?: string | null
          inefficiency_area?: string | null
          matched_pattern_id?: string | null
          next_action?: string | null
          pattern_confidence?: number | null
          pattern_match_confidence?: string | null
          previous_attempts?: string | null
          projected_ebitda_max?: number | null
          projected_ebitda_min?: number | null
          projected_opex_reduction_max?: number | null
          projected_opex_reduction_min?: number | null
          projected_savings_max?: number | null
          projected_savings_min?: number | null
          session_id?: string | null
          success_criteria?: string[] | null
          time_lost_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ebitda_calculator_submissions_matched_pattern_id_fkey"
            columns: ["matched_pattern_id"]
            isOneToOne: false
            referencedRelation: "pattern_library"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_options: {
        Row: {
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          order_index: number | null
          price_range: string | null
          profile_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          order_index?: number | null
          price_range?: string | null
          profile_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          order_index?: number | null
          price_range?: string | null
          profile_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_options_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fallback_images: {
        Row: {
          category: string
          created_at: string | null
          dimensions: Json | null
          generation_metadata: Json | null
          id: string
          image_url: string | null
          is_ai_generated: boolean | null
          last_used_at: string | null
          location: string
          performance_score: number | null
          priority_score: number | null
          prompt: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          dimensions?: Json | null
          generation_metadata?: Json | null
          id?: string
          image_url?: string | null
          is_ai_generated?: boolean | null
          last_used_at?: string | null
          location: string
          performance_score?: number | null
          priority_score?: number | null
          prompt: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          dimensions?: Json | null
          generation_metadata?: Json | null
          id?: string
          image_url?: string | null
          is_ai_generated?: boolean | null
          last_used_at?: string | null
          location?: string
          performance_score?: number | null
          priority_score?: number | null
          prompt?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      frames: {
        Row: {
          ai_prompt_history: Json | null
          beat_id: string | null
          beat_title: string | null
          chapter_id: string
          created_at: string | null
          duration: number | null
          id: string
          media_type: string | null
          narrative_content: string | null
          order_index: number
          updated_at: string | null
          visual_prompt: string | null
        }
        Insert: {
          ai_prompt_history?: Json | null
          beat_id?: string | null
          beat_title?: string | null
          chapter_id: string
          created_at?: string | null
          duration?: number | null
          id?: string
          media_type?: string | null
          narrative_content?: string | null
          order_index?: number
          updated_at?: string | null
          visual_prompt?: string | null
        }
        Update: {
          ai_prompt_history?: Json | null
          beat_id?: string | null
          beat_title?: string | null
          chapter_id?: string
          created_at?: string | null
          duration?: number | null
          id?: string
          media_type?: string | null
          narrative_content?: string | null
          order_index?: number
          updated_at?: string | null
          visual_prompt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "frames_beat_id_fkey"
            columns: ["beat_id"]
            isOneToOne: false
            referencedRelation: "framework_beats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frames_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      framework_beats: {
        Row: {
          beat_name: string
          beat_number: number
          created_at: string | null
          framework_id: string
          guidance_text: string | null
          id: string
        }
        Insert: {
          beat_name: string
          beat_number: number
          created_at?: string | null
          framework_id: string
          guidance_text?: string | null
          id?: string
        }
        Update: {
          beat_name?: string
          beat_number?: number
          created_at?: string | null
          framework_id?: string
          guidance_text?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "framework_beats_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "story_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          model_used: string | null
          narrative_id: string | null
          operation_type: string
          prompt_preview: string | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          model_used?: string | null
          narrative_id?: string | null
          operation_type: string
          prompt_preview?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          model_used?: string | null
          narrative_id?: string | null
          operation_type?: string
          prompt_preview?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generation_logs_narrative_id_fkey"
            columns: ["narrative_id"]
            isOneToOne: false
            referencedRelation: "narratives"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_generation_queue: {
        Row: {
          completed_at: string | null
          context: Json | null
          created_at: string | null
          error_details: string | null
          id: string
          image_type: string
          priority: number | null
          prompt: string
          retry_count: number | null
          scheduled_for: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          context?: Json | null
          created_at?: string | null
          error_details?: string | null
          id?: string
          image_type: string
          priority?: number | null
          prompt: string
          retry_count?: number | null
          scheduled_for?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          context?: Json | null
          created_at?: string | null
          error_details?: string | null
          id?: string
          image_type?: string
          priority?: number | null
          prompt?: string
          retry_count?: number | null
          scheduled_for?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      hero_health_monitoring: {
        Row: {
          active_hero_exists: boolean | null
          active_hero_id: string | null
          auto_recovery_triggered: boolean | null
          check_timestamp: string | null
          fallback_available: boolean | null
          generation_api_available: boolean | null
          id: string
          issues_detected: string[] | null
          load_test_success: boolean | null
          recovery_actions: Json | null
        }
        Insert: {
          active_hero_exists?: boolean | null
          active_hero_id?: string | null
          auto_recovery_triggered?: boolean | null
          check_timestamp?: string | null
          fallback_available?: boolean | null
          generation_api_available?: boolean | null
          id?: string
          issues_detected?: string[] | null
          load_test_success?: boolean | null
          recovery_actions?: Json | null
        }
        Update: {
          active_hero_exists?: boolean | null
          active_hero_id?: string | null
          auto_recovery_triggered?: boolean | null
          check_timestamp?: string | null
          fallback_available?: boolean | null
          generation_api_available?: boolean | null
          id?: string
          issues_detected?: string[] | null
          load_test_success?: boolean | null
          recovery_actions?: Json | null
        }
        Relationships: []
      }
      hero_media_config: {
        Row: {
          archived_at: string | null
          display_settings: Json | null
          file_name: string
          file_size: number | null
          file_url: string
          generation_duration_ms: number | null
          generation_metadata: Json | null
          generation_prompt: string | null
          id: string
          is_active: boolean | null
          is_ai_generated: boolean | null
          media_type: string
          model_version: string | null
          prompt_hash: string | null
          quality_score: number | null
          regeneration_count: number | null
          updated_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          archived_at?: string | null
          display_settings?: Json | null
          file_name: string
          file_size?: number | null
          file_url: string
          generation_duration_ms?: number | null
          generation_metadata?: Json | null
          generation_prompt?: string | null
          id?: string
          is_active?: boolean | null
          is_ai_generated?: boolean | null
          media_type: string
          model_version?: string | null
          prompt_hash?: string | null
          quality_score?: number | null
          regeneration_count?: number | null
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          archived_at?: string | null
          display_settings?: Json | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          generation_duration_ms?: number | null
          generation_metadata?: Json | null
          generation_prompt?: string | null
          id?: string
          is_active?: boolean | null
          is_ai_generated?: boolean | null
          media_type?: string
          model_version?: string | null
          prompt_hash?: string | null
          quality_score?: number | null
          regeneration_count?: number | null
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      hero_prompt_templates: {
        Row: {
          average_quality_score: number | null
          category: string
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          prompt_template: string
          updated_at: string | null
          usage_count: number | null
          variables: Json | null
        }
        Insert: {
          average_quality_score?: number | null
          category: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          prompt_template: string
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Update: {
          average_quality_score?: number | null
          category?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          prompt_template?: string
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Relationships: []
      }
      highlights: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          icon: string | null
          id: string
          profile_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          profile_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          profile_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "highlights_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      image_generation_history: {
        Row: {
          context_data: Json | null
          error_message: string | null
          generated_at: string | null
          generated_url: string | null
          generation_metadata: Json | null
          id: string
          image_id: string | null
          image_type: string
          prompt: string
          retry_count: number | null
          status: string
        }
        Insert: {
          context_data?: Json | null
          error_message?: string | null
          generated_at?: string | null
          generated_url?: string | null
          generation_metadata?: Json | null
          id?: string
          image_id?: string | null
          image_type: string
          prompt: string
          retry_count?: number | null
          status?: string
        }
        Update: {
          context_data?: Json | null
          error_message?: string | null
          generated_at?: string | null
          generated_url?: string | null
          generation_metadata?: Json | null
          id?: string
          image_id?: string | null
          image_type?: string
          prompt?: string
          retry_count?: number | null
          status?: string
        }
        Relationships: []
      }
      investment_opportunities: {
        Row: {
          analysis_scores: Json | null
          category: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          investment_dossier: Json | null
          is_featured: boolean
          source_case_study_id: string | null
          source_inbox_id: string | null
          status: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          analysis_scores?: Json | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          investment_dossier?: Json | null
          is_featured?: boolean
          source_case_study_id?: string | null
          source_inbox_id?: string | null
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          analysis_scores?: Json | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          investment_dossier?: Json | null
          is_featured?: boolean
          source_case_study_id?: string | null
          source_inbox_id?: string | null
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_opportunities_source_case_study_id_fkey"
            columns: ["source_case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_case_studies: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          metric_label: string
          metric_value: string
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          metric_label: string
          metric_value: string
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          metric_label?: string
          metric_value?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      landing_craft_items: {
        Row: {
          badge_text: string | null
          created_at: string | null
          description: string
          icon: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          title: string
          updated_at: string | null
          workflow_steps: string[] | null
        }
        Insert: {
          badge_text?: string | null
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title: string
          updated_at?: string | null
          workflow_steps?: string[] | null
        }
        Update: {
          badge_text?: string | null
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title?: string
          updated_at?: string | null
          workflow_steps?: string[] | null
        }
        Relationships: []
      }
      landing_patterns: {
        Row: {
          case_study_title: string | null
          description: string | null
          icon: string | null
          id: string
          media_type: string | null
          media_url: string | null
          metric_label: string | null
          metric_value: string | null
          order_index: number
          title: string
        }
        Insert: {
          case_study_title?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          metric_label?: string | null
          metric_value?: string | null
          order_index: number
          title: string
        }
        Update: {
          case_study_title?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          metric_label?: string | null
          metric_value?: string | null
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      landing_sections: {
        Row: {
          background_prompt: string | null
          body_copy: string | null
          created_at: string | null
          cta_primary: string | null
          cta_secondary: string | null
          headline: string | null
          id: string
          is_active: boolean | null
          media_type: string | null
          media_url: string | null
          order_index: number | null
          section_key: string
          subheadline: string | null
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          background_prompt?: string | null
          body_copy?: string | null
          created_at?: string | null
          cta_primary?: string | null
          cta_secondary?: string | null
          headline?: string | null
          id?: string
          is_active?: boolean | null
          media_type?: string | null
          media_url?: string | null
          order_index?: number | null
          section_key: string
          subheadline?: string | null
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          background_prompt?: string | null
          body_copy?: string | null
          created_at?: string | null
          cta_primary?: string | null
          cta_secondary?: string | null
          headline?: string | null
          id?: string
          is_active?: boolean | null
          media_type?: string | null
          media_url?: string | null
          order_index?: number | null
          section_key?: string
          subheadline?: string | null
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      librarian_artifacts: {
        Row: {
          checksum: string
          created_at: string
          id: string
          metadata: Json
          raw_content: string
          source_path: string
          source_type: Database["public"]["Enums"]["librarian_artifact_source_type"]
          structured_summary: Json
          tags: string[]
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          checksum: string
          created_at?: string
          id?: string
          metadata?: Json
          raw_content: string
          source_path: string
          source_type?: Database["public"]["Enums"]["librarian_artifact_source_type"]
          structured_summary?: Json
          tags?: string[]
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          checksum?: string
          created_at?: string
          id?: string
          metadata?: Json
          raw_content?: string
          source_path?: string
          source_type?: Database["public"]["Enums"]["librarian_artifact_source_type"]
          structured_summary?: Json
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          case_study_id: string | null
          created_at: string
          id: string
          name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          case_study_id?: string | null
          created_at?: string
          id?: string
          name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          case_study_id?: string | null
          created_at?: string
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          created_at: string | null
          file_size: number | null
          frame_id: string
          generation_model: string | null
          generation_prompt: string | null
          generation_status:
            | Database["public"]["Enums"]["generation_status"]
            | null
          height: number | null
          id: string
          media_type: Database["public"]["Enums"]["media_type"]
          media_url: string
          thumbnail_url: string | null
          width: number | null
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          frame_id: string
          generation_model?: string | null
          generation_prompt?: string | null
          generation_status?:
            | Database["public"]["Enums"]["generation_status"]
            | null
          height?: number | null
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          media_url: string
          thumbnail_url?: string | null
          width?: number | null
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          frame_id?: string
          generation_model?: string | null
          generation_prompt?: string | null
          generation_status?:
            | Database["public"]["Enums"]["generation_status"]
            | null
          height?: number | null
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          media_url?: string
          thumbnail_url?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_frame_id_fkey"
            columns: ["frame_id"]
            isOneToOne: false
            referencedRelation: "frames"
            referencedColumns: ["id"]
          },
        ]
      }
      methodology_framework: {
        Row: {
          created_at: string | null
          description: string
          headline: string
          icon_type: string | null
          id: string
          phase_name: string
          phase_number: number
          updated_at: string | null
          visual_metaphor: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          headline: string
          icon_type?: string | null
          id?: string
          phase_name: string
          phase_number: number
          updated_at?: string | null
          visual_metaphor?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          headline?: string
          icon_type?: string | null
          id?: string
          phase_name?: string
          phase_number?: number
          updated_at?: string | null
          visual_metaphor?: string | null
        }
        Relationships: []
      }
      narratives: {
        Row: {
          ai_cover_prompt: string | null
          created_at: string | null
          description: string | null
          framework_id: string | null
          generated_by: string | null
          generation_metadata: Json | null
          generation_prompt: string | null
          genre: string | null
          id: string
          is_public: boolean | null
          status: Database["public"]["Enums"]["story_status"] | null
          target_audience: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
          visual_style: string | null
        }
        Insert: {
          ai_cover_prompt?: string | null
          created_at?: string | null
          description?: string | null
          framework_id?: string | null
          generated_by?: string | null
          generation_metadata?: Json | null
          generation_prompt?: string | null
          genre?: string | null
          id?: string
          is_public?: boolean | null
          status?: Database["public"]["Enums"]["story_status"] | null
          target_audience?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
          visual_style?: string | null
        }
        Update: {
          ai_cover_prompt?: string | null
          created_at?: string | null
          description?: string | null
          framework_id?: string | null
          generated_by?: string | null
          generation_metadata?: Json | null
          generation_prompt?: string | null
          genre?: string | null
          id?: string
          is_public?: boolean | null
          status?: Database["public"]["Enums"]["story_status"] | null
          target_audience?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
          visual_style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "narratives_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "story_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      notebook_cells: {
        Row: {
          authorship: Database["public"]["Enums"]["authorship_type"] | null
          confidence: number | null
          confidence_level:
            | Database["public"]["Enums"]["confidence_level_type"]
            | null
          content: string | null
          created_at: string
          embedding: string | null
          id: string
          intent_tags: string[] | null
          metadata: Json
          narrative_role:
            | Database["public"]["Enums"]["narrative_role_type"]
            | null
          order_index: number | null
          parent_id: string | null
          relationships: Json | null
          rendered_content: string | null
          role: Database["public"]["Enums"]["cell_role"] | null
          tags: string[] | null
          type: Database["public"]["Enums"]["cell_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          authorship?: Database["public"]["Enums"]["authorship_type"] | null
          confidence?: number | null
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level_type"]
            | null
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          intent_tags?: string[] | null
          metadata?: Json
          narrative_role?:
            | Database["public"]["Enums"]["narrative_role_type"]
            | null
          order_index?: number | null
          parent_id?: string | null
          relationships?: Json | null
          rendered_content?: string | null
          role?: Database["public"]["Enums"]["cell_role"] | null
          tags?: string[] | null
          type?: Database["public"]["Enums"]["cell_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          authorship?: Database["public"]["Enums"]["authorship_type"] | null
          confidence?: number | null
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level_type"]
            | null
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          intent_tags?: string[] | null
          metadata?: Json
          narrative_role?:
            | Database["public"]["Enums"]["narrative_role_type"]
            | null
          order_index?: number | null
          parent_id?: string | null
          relationships?: Json | null
          rendered_content?: string | null
          role?: Database["public"]["Enums"]["cell_role"] | null
          tags?: string[] | null
          type?: Database["public"]["Enums"]["cell_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notebook_cells_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "notebook_cells"
            referencedColumns: ["id"]
          },
        ]
      }
      notebook_links: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          source_id: string
          target_id: string
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          source_id: string
          target_id: string
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          source_id?: string
          target_id?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notebook_links_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "notebook_cells"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notebook_links_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "notebook_cells"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_library: {
        Row: {
          avg_ebitda_impact: number | null
          bomb_factory_applications: string[] | null
          campground_examples: string[] | null
          created_at: string | null
          id: string
          implementations_count: number | null
          is_active: boolean | null
          pattern_description: string
          pattern_name: string
          success_rate: number | null
          updated_at: string | null
        }
        Insert: {
          avg_ebitda_impact?: number | null
          bomb_factory_applications?: string[] | null
          campground_examples?: string[] | null
          created_at?: string | null
          id?: string
          implementations_count?: number | null
          is_active?: boolean | null
          pattern_description: string
          pattern_name: string
          success_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_ebitda_impact?: number | null
          bomb_factory_applications?: string[] | null
          campground_examples?: string[] | null
          created_at?: string | null
          id?: string
          implementations_count?: number | null
          is_active?: boolean | null
          pattern_description?: string
          pattern_name?: string
          success_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio_analyses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_analyzed_at: string | null
          name: string
          return_max: number | null
          return_min: number | null
          risk_tilt: string | null
          synergy_multiplier: number | null
          timeline_years: number | null
          total_committed: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_analyzed_at?: string | null
          name: string
          return_max?: number | null
          return_min?: number | null
          risk_tilt?: string | null
          synergy_multiplier?: number | null
          timeline_years?: number | null
          total_committed?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_analyzed_at?: string | null
          name?: string
          return_max?: number | null
          return_min?: number | null
          risk_tilt?: string | null
          synergy_multiplier?: number | null
          timeline_years?: number | null
          total_committed?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      portfolio_line_items: {
        Row: {
          amount: number
          case_study_id: string
          created_at: string | null
          equity_percent: number | null
          id: string
          instrument: string | null
          investment_thesis: string | null
          portfolio_id: string
          updated_at: string | null
          valuation_cap: number | null
        }
        Insert: {
          amount: number
          case_study_id: string
          created_at?: string | null
          equity_percent?: number | null
          id?: string
          instrument?: string | null
          investment_thesis?: string | null
          portfolio_id: string
          updated_at?: string | null
          valuation_cap?: number | null
        }
        Update: {
          amount?: number
          case_study_id?: string
          created_at?: string | null
          equity_percent?: number | null
          id?: string
          instrument?: string | null
          investment_thesis?: string | null
          portfolio_id?: string
          updated_at?: string | null
          valuation_cap?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_line_items_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_line_items_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          client: string | null
          created_at: string
          description: string | null
          id: string
          image_prompt: string | null
          image_url: string | null
          impact: string[] | null
          is_featured: boolean | null
          name: string
          relevant_for: string[] | null
          sort_order: number | null
          status: string | null
          technologies: string[] | null
          type: string
          updated_at: string
          year: string | null
        }
        Insert: {
          client?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          impact?: string[] | null
          is_featured?: boolean | null
          name: string
          relevant_for?: string[] | null
          sort_order?: number | null
          status?: string | null
          technologies?: string[] | null
          type: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          client?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          impact?: string[] | null
          is_featured?: boolean | null
          name?: string
          relevant_for?: string[] | null
          sort_order?: number | null
          status?: string | null
          technologies?: string[] | null
          type?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      portfolio_snapshots: {
        Row: {
          created_at: string | null
          id: string
          portfolio_id: string
          snapshot_data: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          portfolio_id: string
          snapshot_data: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          portfolio_id?: string
          snapshot_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_snapshots_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          github: string | null
          id: string
          linkedin: string | null
          location: string | null
          name: string
          phone: string | null
          rate: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          github?: string | null
          id?: string
          linkedin?: string | null
          location?: string | null
          name: string
          phone?: string | null
          rate?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          availability?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          github?: string | null
          id?: string
          linkedin?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          rate?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          impact: string | null
          metrics: Json | null
          order_index: number | null
          profile_id: string
          role: string | null
          tech_stack: string[] | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          impact?: string | null
          metrics?: Json | null
          order_index?: number | null
          profile_id: string
          role?: string | null
          tech_stack?: string[] | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          impact?: string | null
          metrics?: Json | null
          order_index?: number | null
          profile_id?: string
          role?: string | null
          tech_stack?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_templates: {
        Row: {
          created_at: string | null
          id: string
          name: string
          prompt: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          prompt: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          prompt?: string
        }
        Relationships: []
      }
      prompt_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          prompt_id: string | null
          prompt_template: string
          version_number: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          prompt_id?: string | null
          prompt_template: string
          version_number: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          prompt_id?: string | null
          prompt_template?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_versions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "system_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          author: Json
          blocks: Json
          created_at: string
          id: string
          published_at: string | null
          slug: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          author?: Json
          blocks?: Json
          created_at?: string
          id?: string
          published_at?: string | null
          slug: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          author?: Json
          blocks?: Json
          created_at?: string
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          order_index: number | null
          proficiency: number | null
          profile_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number | null
          proficiency?: number | null
          profile_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number | null
          proficiency?: number | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stats: {
        Row: {
          created_at: string | null
          efficiency_reduction: number | null
          id: string
          profile_id: string
          solutions_count: number | null
          total_impact: string | null
          years_experience: number | null
        }
        Insert: {
          created_at?: string | null
          efficiency_reduction?: number | null
          id?: string
          profile_id: string
          solutions_count?: number | null
          total_impact?: string | null
          years_experience?: number | null
        }
        Update: {
          created_at?: string | null
          efficiency_reduction?: number | null
          id?: string
          profile_id?: string
          solutions_count?: number | null
          total_impact?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stats_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      story_engagements: {
        Row: {
          created_at: string
          engagement_type: string
          id: string
          narrative_id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          engagement_type: string
          id?: string
          narrative_id: string
          session_id: string
        }
        Update: {
          created_at?: string
          engagement_type?: string
          id?: string
          narrative_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_engagements_narrative_id_fkey"
            columns: ["narrative_id"]
            isOneToOne: false
            referencedRelation: "narratives"
            referencedColumns: ["id"]
          },
        ]
      }
      story_frameworks: {
        Row: {
          beat_count: number
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          beat_count?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          beat_count?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_prompts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          profile_id: string | null
          prompt_name: string
          prompt_template: string
          prompt_type: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          profile_id?: string | null
          prompt_name: string
          prompt_template: string
          prompt_type: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          profile_id?: string | null
          prompt_name?: string
          prompt_template?: string
          prompt_type?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "system_prompts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      agent_registry_due_schedules: {
        Row: {
          agent_id: string | null
          cadence: Database["public"]["Enums"]["agent_cadence"] | null
          created_at: string | null
          id: string | null
          last_run_at: string | null
          metadata: Json | null
          next_run_at: string | null
          prompt_template: string | null
          run_day_of_month: number | null
          run_day_of_week: number | null
          run_hour_local: number | null
          run_minute_local: number | null
          status: Database["public"]["Enums"]["agent_schedule_status"] | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          cadence?: Database["public"]["Enums"]["agent_cadence"] | null
          created_at?: string | null
          id?: string | null
          last_run_at?: string | null
          metadata?: Json | null
          next_run_at?: string | null
          prompt_template?: string | null
          run_day_of_month?: number | null
          run_day_of_week?: number | null
          run_hour_local?: number | null
          run_minute_local?: number | null
          status?: Database["public"]["Enums"]["agent_schedule_status"] | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          cadence?: Database["public"]["Enums"]["agent_cadence"] | null
          created_at?: string | null
          id?: string | null
          last_run_at?: string | null
          metadata?: Json | null
          next_run_at?: string | null
          prompt_template?: string | null
          run_day_of_month?: number | null
          run_day_of_week?: number | null
          run_hour_local?: number | null
          run_minute_local?: number | null
          status?: Database["public"]["Enums"]["agent_schedule_status"] | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_registry_schedules_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agent_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_opportunities_investor_ready: {
        Row: {
          analysis_scores: Json | null
          audiences: Json | null
          category: string | null
          cover_image_url: string | null
          created_at: string | null
          features: Json | null
          id: string | null
          investment_dossier: Json | null
          is_featured: boolean | null
          prd: Json | null
          problem: string | null
          social_posts_data: Json | null
          solution: string | null
          source_case_study_id: string | null
          source_inbox_id: string | null
          status: string | null
          summary: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          visual_concepts: Json | null
        }
        Relationships: []
      }
      investment_opportunities_unified: {
        Row: {
          analysis_scores: Json | null
          audiences: Json | null
          category: string | null
          cover_image_url: string | null
          created_at: string | null
          features: Json | null
          id: string | null
          investment_dossier: Json | null
          is_featured: boolean | null
          prd: Json | null
          problem: string | null
          social_posts_data: Json | null
          solution: string | null
          source_case_study_id: string | null
          source_inbox_id: string | null
          status: string | null
          summary: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          visual_concepts: Json | null
        }
        Relationships: []
      }
      my_campaign_assets: {
        Row: {
          created_at: string | null
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          path: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          path?: never
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          path?: never
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      campaigns_user_prefix: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_uuid_array: { Args: { arr: Json }; Returns: boolean }
    }
    Enums: {
      agent_cadence: "weekly" | "monthly"
      agent_registry_status: "candidate" | "active" | "paused" | "archived"
      agent_schedule_status: "active" | "paused"
      app_role: "admin" | "creator" | "viewer"
      authorship_type: "human" | "system" | "hybrid"
      cell_role:
        | "note"
        | "problem"
        | "insight"
        | "solution"
        | "system"
        | "component"
      cell_type:
        | "text"
        | "image"
        | "sketch"
        | "diagram"
        | "code"
        | "link"
        | "pdf"
      conductor_notification_type:
        | "weekly_digest"
        | "budget_alert"
        | "needs_review_alert"
        | "task_failed"
        | "task_completed_high_value"
        | "system"
      conductor_task_status:
        | "created"
        | "queued"
        | "waiting"
        | "running"
        | "quality_check"
        | "completed"
        | "needs_review"
        | "failed"
        | "archived"
      confidence_level_type: "draft" | "exploratory" | "validated" | "archived"
      generation_status: "pending" | "processing" | "completed" | "failed"
      job_status: "pending" | "processing" | "completed" | "failed"
      job_type: "intake_dossier" | "prospect_prep"
      librarian_artifact_source_type:
        | "markdown"
        | "readme"
        | "audit"
        | "changelog"
        | "log"
        | "other"
      media_type: "image" | "video" | "audio"
      narrative_role_type:
        | "problem"
        | "insight"
        | "solution"
        | "context"
        | "question"
        | "evidence"
      story_status: "draft" | "published" | "archived"
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
      agent_cadence: ["weekly", "monthly"],
      agent_registry_status: ["candidate", "active", "paused", "archived"],
      agent_schedule_status: ["active", "paused"],
      app_role: ["admin", "creator", "viewer"],
      authorship_type: ["human", "system", "hybrid"],
      cell_role: [
        "note",
        "problem",
        "insight",
        "solution",
        "system",
        "component",
      ],
      cell_type: ["text", "image", "sketch", "diagram", "code", "link", "pdf"],
      conductor_notification_type: [
        "weekly_digest",
        "budget_alert",
        "needs_review_alert",
        "task_failed",
        "task_completed_high_value",
        "system",
      ],
      conductor_task_status: [
        "created",
        "queued",
        "waiting",
        "running",
        "quality_check",
        "completed",
        "needs_review",
        "failed",
        "archived",
      ],
      confidence_level_type: ["draft", "exploratory", "validated", "archived"],
      generation_status: ["pending", "processing", "completed", "failed"],
      job_status: ["pending", "processing", "completed", "failed"],
      job_type: ["intake_dossier", "prospect_prep"],
      librarian_artifact_source_type: [
        "markdown",
        "readme",
        "audit",
        "changelog",
        "log",
        "other",
      ],
      media_type: ["image", "video", "audio"],
      narrative_role_type: [
        "problem",
        "insight",
        "solution",
        "context",
        "question",
        "evidence",
      ],
      story_status: ["draft", "published", "archived"],
    },
  },
} as const

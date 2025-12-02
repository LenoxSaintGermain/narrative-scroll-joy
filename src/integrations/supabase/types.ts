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
      campground_job_queue: {
        Row: {
          created_at: string | null
          error: string | null
          id: string
          payload: Json
          processed_at: string | null
          status: string
          type: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          id?: string
          payload: Json
          processed_at?: string | null
          status?: string
          type: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          id?: string
          payload?: Json
          processed_at?: string | null
          status?: string
          type?: string
        }
        Relationships: []
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
          chapter_id: string
          created_at: string | null
          id: string
          narrative_content: string | null
          order_index: number
          updated_at: string | null
        }
        Insert: {
          ai_prompt_history?: Json | null
          beat_id?: string | null
          chapter_id: string
          created_at?: string | null
          id?: string
          narrative_content?: string | null
          order_index?: number
          updated_at?: string | null
        }
        Update: {
          ai_prompt_history?: Json | null
          beat_id?: string | null
          chapter_id?: string
          created_at?: string | null
          id?: string
          narrative_content?: string | null
          order_index?: number
          updated_at?: string | null
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
          created_at: string | null
          description: string | null
          framework_id: string | null
          id: string
          is_public: boolean | null
          status: Database["public"]["Enums"]["story_status"] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          framework_id?: string | null
          id?: string
          is_public?: boolean | null
          status?: Database["public"]["Enums"]["story_status"] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          framework_id?: string | null
          id?: string
          is_public?: boolean | null
          status?: Database["public"]["Enums"]["story_status"] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
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
      app_role: "admin" | "creator" | "viewer"
      generation_status: "pending" | "processing" | "completed" | "failed"
      media_type: "image" | "video" | "audio"
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
      app_role: ["admin", "creator", "viewer"],
      generation_status: ["pending", "processing", "completed", "failed"],
      media_type: ["image", "video", "audio"],
      story_status: ["draft", "published", "archived"],
    },
  },
} as const

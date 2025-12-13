export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: 'player' | 'manager' | 'director'
          avatar_url: string | null
          location_latitude: number | null
          location_longitude: number | null
          search_radius_miles: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          role: 'player' | 'manager' | 'director'
          avatar_url?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          search_radius_miles?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: 'player' | 'manager' | 'director'
          avatar_url?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          search_radius_miles?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      leagues: {
        Row: {
          id: string
          name: string
          description: string | null
          skill_level: 'beginner' | 'intermediate' | 'advanced' | 'competitive'
          location: string
          location_latitude: number | null
          location_longitude: number | null
          season_start: string
          season_end: string
          registration_deadline: string
          base_fee: number
          max_teams: number
          current_teams: number
          status: 'open' | 'full' | 'closed'
          director_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          skill_level: 'beginner' | 'intermediate' | 'advanced' | 'competitive'
          location: string
          location_latitude?: number | null
          location_longitude?: number | null
          season_start: string
          season_end: string
          registration_deadline: string
          base_fee: number
          max_teams: number
          current_teams?: number
          status?: 'open' | 'full' | 'closed'
          director_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'competitive'
          location?: string
          location_latitude?: number | null
          location_longitude?: number | null
          season_start?: string
          season_end?: string
          registration_deadline?: string
          base_fee?: number
          max_teams?: number
          current_teams?: number
          status?: 'open' | 'full' | 'closed'
          director_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tournaments: {
        Row: {
          id: string
          name: string
          description: string | null
          skill_level: 'beginner' | 'intermediate' | 'advanced' | 'competitive'
          location: string
          start_date: string
          end_date: string
          registration_deadline: string
          entry_fee: number
          max_teams: number
          current_teams: number
          format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'pool_play'
          prize_pool: number | null
          status: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled'
          director_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          skill_level: 'beginner' | 'intermediate' | 'advanced' | 'competitive'
          location: string
          start_date: string
          end_date: string
          registration_deadline: string
          entry_fee?: number
          max_teams?: number
          current_teams?: number
          format?: 'single_elimination' | 'double_elimination' | 'round_robin' | 'pool_play'
          prize_pool?: number | null
          status?: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled'
          director_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'competitive'
          location?: string
          start_date?: string
          end_date?: string
          registration_deadline?: string
          entry_fee?: number
          max_teams?: number
          current_teams?: number
          format?: 'single_elimination' | 'double_elimination' | 'round_robin' | 'pool_play'
          prize_pool?: number | null
          status?: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled'
          director_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          league_id: string
          manager_id: string
          logo_url: string | null
          description: string | null
          max_players: number
          current_players: number
          total_fee: number
          paid_amount: number
          status: 'draft' | 'active' | 'full' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          league_id: string
          manager_id: string
          logo_url?: string | null
          description?: string | null
          max_players?: number
          current_players?: number
          total_fee?: number
          paid_amount?: number
          status?: 'draft' | 'active' | 'full' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          league_id?: string
          manager_id?: string
          logo_url?: string | null
          description?: string | null
          max_players?: number
          current_players?: number
          total_fee?: number
          paid_amount?: number
          status?: 'draft' | 'active' | 'full' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          user_id: string
          team_id: string | null
          jersey_number: number | null
          position: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          payment_status: 'unpaid' | 'partial' | 'paid'
          amount_paid: number
          amount_due: number
          is_free_agent: boolean
          bio: string | null
          experience_level: 'beginner' | 'intermediate' | 'advanced'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          team_id?: string | null
          jersey_number?: number | null
          position?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          payment_status?: 'unpaid' | 'partial' | 'paid'
          amount_paid?: number
          amount_due?: number
          is_free_agent?: boolean
          bio?: string | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          team_id?: string | null
          jersey_number?: number | null
          position?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          payment_status?: 'unpaid' | 'partial' | 'paid'
          amount_paid?: number
          amount_due?: number
          is_free_agent?: boolean
          bio?: string | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          player_id: string
          team_id: string
          amount: number
          type: 'registration' | 'equipment' | 'late_fee' | 'refund'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: string | null
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          team_id: string
          amount: number
          type: 'registration' | 'equipment' | 'late_fee' | 'refund'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          team_id?: string
          amount?: number
          type?: 'registration' | 'equipment' | 'late_fee' | 'refund'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          type: 'team' | 'direct'
          title: string | null
          team_id: string | null
          last_message_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'team' | 'direct'
          title?: string | null
          team_id?: string | null
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'team' | 'direct'
          title?: string | null
          team_id?: string | null
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string | null
          message_type: 'text' | 'image' | 'system'
          image_url: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content?: string | null
          message_type?: 'text' | 'image' | 'system'
          image_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string | null
          message_type?: 'text' | 'image' | 'system'
          image_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          last_read_at: string
          muted: boolean
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          last_read_at?: string
          muted?: boolean
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          last_read_at?: string
          muted?: boolean
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
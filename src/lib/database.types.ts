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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      advisee_notices: {
        Row: {
          advisor_id: string | null
          body: string
          created_at: string | null
          id: string
          student_id: string | null
        }
        Insert: {
          advisor_id?: string | null
          body: string
          created_at?: string | null
          id?: string
          student_id?: string | null
        }
        Update: {
          advisor_id?: string | null
          body?: string
          created_at?: string | null
          id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisee_notices_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisee_notices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          body_ar: string | null
          body_en: string | null
          category: string | null
          id: string
          published_at: string | null
          title_ar: string | null
          title_en: string | null
        }
        Insert: {
          body_ar?: string | null
          body_en?: string | null
          category?: string | null
          id?: string
          published_at?: string | null
          title_ar?: string | null
          title_en?: string | null
        }
        Update: {
          body_ar?: string | null
          body_en?: string | null
          category?: string | null
          id?: string
          published_at?: string | null
          title_ar?: string | null
          title_en?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          reason: string | null
          starts_at: string
          status: string
          student_id: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          reason?: string | null
          starts_at: string
          status?: string
          student_id: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          reason?: string | null
          starts_at?: string
          status?: string
          student_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          profile_id: string
        }
        Insert: {
          conversation_id: string
          profile_id: string
        }
        Update: {
          conversation_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      directory_entries: {
        Row: {
          department: string | null
          email: string | null
          id: string
          name_ar: string | null
          name_en: string | null
          office: string | null
          phone: string | null
          title_ar: string | null
          title_en: string | null
        }
        Insert: {
          department?: string | null
          email?: string | null
          id?: string
          name_ar?: string | null
          name_en?: string | null
          office?: string | null
          phone?: string | null
          title_ar?: string | null
          title_en?: string | null
        }
        Update: {
          department?: string | null
          email?: string | null
          id?: string
          name_ar?: string | null
          name_en?: string | null
          office?: string | null
          phone?: string | null
          title_ar?: string | null
          title_en?: string | null
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          event_id: string
          user_id: string
        }
        Insert: {
          event_id: string
          user_id: string
        }
        Update: {
          event_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          desc_ar: string | null
          desc_en: string | null
          ends_at: string | null
          id: string
          location_ar: string | null
          location_en: string | null
          starts_at: string | null
          title_ar: string | null
          title_en: string | null
        }
        Insert: {
          category?: string | null
          desc_ar?: string | null
          desc_en?: string | null
          ends_at?: string | null
          id?: string
          location_ar?: string | null
          location_en?: string | null
          starts_at?: string | null
          title_ar?: string | null
          title_en?: string | null
        }
        Update: {
          category?: string | null
          desc_ar?: string | null
          desc_en?: string | null
          ends_at?: string | null
          id?: string
          location_ar?: string | null
          location_en?: string | null
          starts_at?: string | null
          title_ar?: string | null
          title_en?: string | null
        }
        Relationships: []
      }
      excuses: {
        Row: {
          file_path: string | null
          from_date: string | null
          id: string
          note: string | null
          reviewer_id: string | null
          status: string | null
          student_id: string | null
          submitted_at: string | null
          to_date: string | null
          type: string | null
        }
        Insert: {
          file_path?: string | null
          from_date?: string | null
          id?: string
          note?: string | null
          reviewer_id?: string | null
          status?: string | null
          student_id?: string | null
          submitted_at?: string | null
          to_date?: string | null
          type?: string | null
        }
        Update: {
          file_path?: string | null
          from_date?: string | null
          id?: string
          note?: string | null
          reviewer_id?: string | null
          status?: string | null
          student_id?: string | null
          submitted_at?: string | null
          to_date?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "excuses_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "excuses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_orders: {
        Row: {
          created_at: string | null
          deliver_to: string
          id: string
          items: Json
          status: string
          total: number
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          deliver_to: string
          id?: string
          items?: Json
          status?: string
          total?: number
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          deliver_to?: string
          id?: string
          items?: Json
          status?: string
          total?: number
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "food_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      food_vendors: {
        Row: {
          cuisine_ar: string | null
          cuisine_en: string | null
          emoji: string | null
          hours: string | null
          id: string
          location_ar: string | null
          location_en: string | null
          name_ar: string | null
          name_en: string | null
          open: boolean | null
          owner_id: string | null
          rating: number | null
        }
        Insert: {
          cuisine_ar?: string | null
          cuisine_en?: string | null
          emoji?: string | null
          hours?: string | null
          id?: string
          location_ar?: string | null
          location_en?: string | null
          name_ar?: string | null
          name_en?: string | null
          open?: boolean | null
          owner_id?: string | null
          rating?: number | null
        }
        Update: {
          cuisine_ar?: string | null
          cuisine_en?: string | null
          emoji?: string | null
          hours?: string | null
          id?: string
          location_ar?: string | null
          location_en?: string | null
          name_ar?: string | null
          name_en?: string | null
          open?: boolean | null
          owner_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "food_vendors_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          code: string | null
          credits: number | null
          grade: string | null
          id: string
          points: number | null
          student_id: string | null
          title_ar: string | null
          title_en: string | null
        }
        Insert: {
          code?: string | null
          credits?: number | null
          grade?: string | null
          id?: string
          points?: number | null
          student_id?: string | null
          title_ar?: string | null
          title_en?: string | null
        }
        Update: {
          code?: string | null
          credits?: number | null
          grade?: string | null
          id?: string
          points?: number | null
          student_id?: string | null
          title_ar?: string | null
          title_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invigilations: {
        Row: {
          end_time: string | null
          exam_ar: string | null
          exam_date: string | null
          exam_en: string | null
          id: string
          role: string | null
          room: string | null
          start_time: string | null
          teacher_id: string | null
        }
        Insert: {
          end_time?: string | null
          exam_ar?: string | null
          exam_date?: string | null
          exam_en?: string | null
          id?: string
          role?: string | null
          room?: string | null
          start_time?: string | null
          teacher_id?: string | null
        }
        Update: {
          end_time?: string | null
          exam_ar?: string | null
          exam_date?: string | null
          exam_en?: string | null
          id?: string
          role?: string | null
          room?: string | null
          start_time?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invigilations_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mailbox: {
        Row: {
          from_ar: string | null
          from_en: string | null
          id: string
          preview_ar: string | null
          preview_en: string | null
          recipient_id: string
          sent_at: string | null
          subject_ar: string | null
          subject_en: string | null
          unread: boolean
        }
        Insert: {
          from_ar?: string | null
          from_en?: string | null
          id?: string
          preview_ar?: string | null
          preview_en?: string | null
          recipient_id: string
          sent_at?: string | null
          subject_ar?: string | null
          subject_en?: string | null
          unread?: boolean
        }
        Update: {
          from_ar?: string | null
          from_en?: string | null
          id?: string
          preview_ar?: string | null
          preview_en?: string | null
          recipient_id?: string
          sent_at?: string | null
          subject_ar?: string | null
          subject_en?: string | null
          unread?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "mailbox_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          available: boolean
          category: string | null
          desc_ar: string | null
          desc_en: string | null
          emoji: string | null
          id: string
          image_path: string | null
          name_ar: string | null
          name_en: string | null
          price: number | null
          vendor_id: string | null
        }
        Insert: {
          available?: boolean
          category?: string | null
          desc_ar?: string | null
          desc_en?: string | null
          emoji?: string | null
          id?: string
          image_path?: string | null
          name_ar?: string | null
          name_en?: string | null
          price?: number | null
          vendor_id?: string | null
        }
        Update: {
          available?: boolean
          category?: string | null
          desc_ar?: string | null
          desc_en?: string | null
          emoji?: string | null
          id?: string
          image_path?: string | null
          name_ar?: string | null
          name_en?: string | null
          price?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "food_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          conversation_id: string | null
          created_at: string | null
          id: string
          sender_id: string | null
        }
        Insert: {
          body: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender_id?: string | null
        }
        Update: {
          body?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      office_hours: {
        Row: {
          created_at: string
          end_time: string
          id: string
          location: string | null
          slot_minutes: number
          start_time: string
          teacher_id: string
          weekday: number
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          location?: string | null
          slot_minutes?: number
          start_time: string
          teacher_id: string
          weekday: number
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          location?: string | null
          slot_minutes?: number
          start_time?: string
          teacher_id?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "office_hours_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          advisor_id: string | null
          avatar_color: string | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string | null
          gpa: number | null
          id: string
          level: string | null
          name_ar: string
          name_en: string
          program_ar: string | null
          program_en: string | null
          role: Database["public"]["Enums"]["user_role"]
          standing: string | null
          university_id: string
        }
        Insert: {
          advisor_id?: string | null
          avatar_color?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          gpa?: number | null
          id: string
          level?: string | null
          name_ar: string
          name_en: string
          program_ar?: string | null
          program_en?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          standing?: string | null
          university_id: string
        }
        Update: {
          advisor_id?: string | null
          avatar_color?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          gpa?: number | null
          id?: string
          level?: string | null
          name_ar?: string
          name_en?: string
          program_ar?: string | null
          program_en?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          standing?: string | null
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      push_tokens: {
        Row: {
          created_at: string | null
          id: string
          platform: string | null
          token: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform?: string | null
          token?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string | null
          token?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string | null
          done: boolean
          due_at: string
          id: string
          kind: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          done?: boolean
          due_at: string
          id?: string
          kind?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          done?: boolean
          due_at?: string
          id?: string
          kind?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      research_items: {
        Row: {
          id: string
          meta_ar: string | null
          meta_en: string | null
          published_at: string | null
          title_ar: string | null
          title_en: string | null
          type: string | null
        }
        Insert: {
          id?: string
          meta_ar?: string | null
          meta_en?: string | null
          published_at?: string | null
          title_ar?: string | null
          title_en?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          meta_ar?: string | null
          meta_en?: string | null
          published_at?: string | null
          title_ar?: string | null
          title_en?: string | null
          type?: string | null
        }
        Relationships: []
      }
      schedule_entries: {
        Row: {
          color: string | null
          course_code: string
          day: number
          end_time: string
          id: string
          instructor_ar: string | null
          instructor_en: string | null
          profile_id: string
          room: string | null
          start_time: string
          title_ar: string
          title_en: string
        }
        Insert: {
          color?: string | null
          course_code: string
          day: number
          end_time: string
          id?: string
          instructor_ar?: string | null
          instructor_en?: string | null
          profile_id: string
          room?: string | null
          start_time: string
          title_ar: string
          title_en: string
        }
        Update: {
          color?: string | null
          course_code?: string
          day?: number
          end_time?: string
          id?: string
          instructor_ar?: string | null
          instructor_en?: string | null
          profile_id?: string
          room?: string | null
          start_time?: string
          title_ar?: string
          title_en?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_entries_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shuttle_routes: {
        Row: {
          color: string | null
          every_minutes: number | null
          from_ar: string | null
          from_en: string | null
          id: string
          name_ar: string | null
          name_en: string | null
          times: string[] | null
          to_ar: string | null
          to_en: string | null
        }
        Insert: {
          color?: string | null
          every_minutes?: number | null
          from_ar?: string | null
          from_en?: string | null
          id?: string
          name_ar?: string | null
          name_en?: string | null
          times?: string[] | null
          to_ar?: string | null
          to_en?: string | null
        }
        Update: {
          color?: string | null
          every_minutes?: number | null
          from_ar?: string | null
          from_en?: string | null
          id?: string
          name_ar?: string | null
          name_en?: string | null
          times?: string[] | null
          to_ar?: string | null
          to_en?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_conversation_member: { Args: { cid: string }; Returns: boolean }
      my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      start_conversation: { Args: { other_id: string }; Returns: string }
    }
    Enums: {
      user_role:
        | "student"
        | "teacher"
        | "advisor"
        | "student_affairs"
        | "vendor"
        | "admin"
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
      user_role: [
        "student",
        "teacher",
        "advisor",
        "student_affairs",
        "vendor",
        "admin",
      ],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      advisee_notices: {
        Row: { advisor_id: string | null; body: string; created_at: string | null; id: string; student_id: string | null }
        Insert: { advisor_id?: string | null; body: string; created_at?: string | null; id?: string; student_id?: string | null }
        Update: { advisor_id?: string | null; body?: string; created_at?: string | null; id?: string; student_id?: string | null }
        Relationships: []
      }
      announcements: {
        Row: { body_ar: string | null; body_en: string | null; category: string | null; id: string; published_at: string | null; title_ar: string | null; title_en: string | null }
        Insert: { body_ar?: string | null; body_en?: string | null; category?: string | null; id?: string; published_at?: string | null; title_ar?: string | null; title_en?: string | null }
        Update: { body_ar?: string | null; body_en?: string | null; category?: string | null; id?: string; published_at?: string | null; title_ar?: string | null; title_en?: string | null }
        Relationships: []
      }
      conversation_participants: {
        Row: { conversation_id: string; profile_id: string }
        Insert: { conversation_id: string; profile_id: string }
        Update: { conversation_id?: string; profile_id?: string }
        Relationships: []
      }
      conversations: {
        Row: { created_at: string | null; id: string }
        Insert: { created_at?: string | null; id?: string }
        Update: { created_at?: string | null; id?: string }
        Relationships: []
      }
      directory_entries: {
        Row: { department: string | null; email: string | null; id: string; name_ar: string | null; name_en: string | null; office: string | null; phone: string | null; title_ar: string | null; title_en: string | null }
        Insert: { department?: string | null; email?: string | null; id?: string; name_ar?: string | null; name_en?: string | null; office?: string | null; phone?: string | null; title_ar?: string | null; title_en?: string | null }
        Update: { department?: string | null; email?: string | null; id?: string; name_ar?: string | null; name_en?: string | null; office?: string | null; phone?: string | null; title_ar?: string | null; title_en?: string | null }
        Relationships: []
      }
      event_rsvps: {
        Row: { event_id: string; user_id: string }
        Insert: { event_id: string; user_id: string }
        Update: { event_id?: string; user_id?: string }
        Relationships: []
      }
      events: {
        Row: { category: string | null; desc_ar: string | null; desc_en: string | null; ends_at: string | null; id: string; location_ar: string | null; location_en: string | null; starts_at: string | null; title_ar: string | null; title_en: string | null }
        Insert: { category?: string | null; desc_ar?: string | null; desc_en?: string | null; ends_at?: string | null; id?: string; location_ar?: string | null; location_en?: string | null; starts_at?: string | null; title_ar?: string | null; title_en?: string | null }
        Update: { category?: string | null; desc_ar?: string | null; desc_en?: string | null; ends_at?: string | null; id?: string; location_ar?: string | null; location_en?: string | null; starts_at?: string | null; title_ar?: string | null; title_en?: string | null }
        Relationships: []
      }
      excuses: {
        Row: { file_path: string | null; from_date: string | null; id: string; note: string | null; reviewer_id: string | null; status: string | null; student_id: string | null; submitted_at: string | null; to_date: string | null; type: string | null }
        Insert: { file_path?: string | null; from_date?: string | null; id?: string; note?: string | null; reviewer_id?: string | null; status?: string | null; student_id?: string | null; submitted_at?: string | null; to_date?: string | null; type?: string | null }
        Update: { file_path?: string | null; from_date?: string | null; id?: string; note?: string | null; reviewer_id?: string | null; status?: string | null; student_id?: string | null; submitted_at?: string | null; to_date?: string | null; type?: string | null }
        Relationships: []
      }
      food_vendors: {
        Row: { cuisine_ar: string | null; cuisine_en: string | null; emoji: string | null; hours: string | null; id: string; location_ar: string | null; location_en: string | null; name_ar: string | null; name_en: string | null; open: boolean | null; owner_id: string | null; rating: number | null }
        Insert: { cuisine_ar?: string | null; cuisine_en?: string | null; emoji?: string | null; hours?: string | null; id?: string; location_ar?: string | null; location_en?: string | null; name_ar?: string | null; name_en?: string | null; open?: boolean | null; owner_id?: string | null; rating?: number | null }
        Update: { cuisine_ar?: string | null; cuisine_en?: string | null; emoji?: string | null; hours?: string | null; id?: string; location_ar?: string | null; location_en?: string | null; name_ar?: string | null; name_en?: string | null; open?: boolean | null; owner_id?: string | null; rating?: number | null }
        Relationships: []
      }
      grades: {
        Row: { code: string | null; credits: number | null; grade: string | null; id: string; points: number | null; student_id: string | null; title_ar: string | null; title_en: string | null }
        Insert: { code?: string | null; credits?: number | null; grade?: string | null; id?: string; points?: number | null; student_id?: string | null; title_ar?: string | null; title_en?: string | null }
        Update: { code?: string | null; credits?: number | null; grade?: string | null; id?: string; points?: number | null; student_id?: string | null; title_ar?: string | null; title_en?: string | null }
        Relationships: []
      }
      invigilations: {
        Row: { end_time: string | null; exam_ar: string | null; exam_date: string | null; exam_en: string | null; id: string; role: string | null; room: string | null; start_time: string | null; teacher_id: string | null }
        Insert: { end_time?: string | null; exam_ar?: string | null; exam_date?: string | null; exam_en?: string | null; id?: string; role?: string | null; room?: string | null; start_time?: string | null; teacher_id?: string | null }
        Update: { end_time?: string | null; exam_ar?: string | null; exam_date?: string | null; exam_en?: string | null; id?: string; role?: string | null; room?: string | null; start_time?: string | null; teacher_id?: string | null }
        Relationships: []
      }
      mailbox: {
        Row: { from_ar: string | null; from_en: string | null; id: string; preview_ar: string | null; preview_en: string | null; recipient_id: string; sent_at: string | null; subject_ar: string | null; subject_en: string | null; unread: boolean }
        Insert: { from_ar?: string | null; from_en?: string | null; id?: string; preview_ar?: string | null; preview_en?: string | null; recipient_id: string; sent_at?: string | null; subject_ar?: string | null; subject_en?: string | null; unread?: boolean }
        Update: { from_ar?: string | null; from_en?: string | null; id?: string; preview_ar?: string | null; preview_en?: string | null; recipient_id?: string; sent_at?: string | null; subject_ar?: string | null; subject_en?: string | null; unread?: boolean }
        Relationships: []
      }
      menu_items: {
        Row: { available: boolean; category: string | null; desc_ar: string | null; desc_en: string | null; emoji: string | null; id: string; image_path: string | null; name_ar: string | null; name_en: string | null; price: number | null; vendor_id: string | null }
        Insert: { available?: boolean; category?: string | null; desc_ar?: string | null; desc_en?: string | null; emoji?: string | null; id?: string; image_path?: string | null; name_ar?: string | null; name_en?: string | null; price?: number | null; vendor_id?: string | null }
        Update: { available?: boolean; category?: string | null; desc_ar?: string | null; desc_en?: string | null; emoji?: string | null; id?: string; image_path?: string | null; name_ar?: string | null; name_en?: string | null; price?: number | null; vendor_id?: string | null }
        Relationships: []
      }
      messages: {
        Row: { body: string; conversation_id: string | null; created_at: string | null; id: string; sender_id: string | null }
        Insert: { body: string; conversation_id?: string | null; created_at?: string | null; id?: string; sender_id?: string | null }
        Update: { body?: string; conversation_id?: string | null; created_at?: string | null; id?: string; sender_id?: string | null }
        Relationships: []
      }
      profiles: {
        Row: { advisor_id: string | null; avatar_color: string | null; created_at: string | null; department: string | null; email: string | null; gpa: number | null; id: string; level: string | null; name_ar: string; name_en: string; program_ar: string | null; program_en: string | null; role: Database["public"]["Enums"]["user_role"]; standing: string | null; university_id: string }
        Insert: { advisor_id?: string | null; avatar_color?: string | null; created_at?: string | null; department?: string | null; email?: string | null; gpa?: number | null; id: string; level?: string | null; name_ar: string; name_en: string; program_ar?: string | null; program_en?: string | null; role?: Database["public"]["Enums"]["user_role"]; standing?: string | null; university_id: string }
        Update: { advisor_id?: string | null; avatar_color?: string | null; created_at?: string | null; department?: string | null; email?: string | null; gpa?: number | null; id?: string; level?: string | null; name_ar?: string; name_en?: string; program_ar?: string | null; program_en?: string | null; role?: Database["public"]["Enums"]["user_role"]; standing?: string | null; university_id?: string }
        Relationships: []
      }
      push_tokens: {
        Row: { created_at: string | null; id: string; platform: string | null; token: string | null; user_id: string | null }
        Insert: { created_at?: string | null; id?: string; platform?: string | null; token?: string | null; user_id?: string | null }
        Update: { created_at?: string | null; id?: string; platform?: string | null; token?: string | null; user_id?: string | null }
        Relationships: []
      }
      reminders: {
        Row: { created_at: string | null; done: boolean; due_at: string; id: string; kind: string | null; title: string; user_id: string }
        Insert: { created_at?: string | null; done?: boolean; due_at: string; id?: string; kind?: string | null; title: string; user_id: string }
        Update: { created_at?: string | null; done?: boolean; due_at?: string; id?: string; kind?: string | null; title?: string; user_id?: string }
        Relationships: []
      }
      research_items: {
        Row: { id: string; meta_ar: string | null; meta_en: string | null; published_at: string | null; title_ar: string | null; title_en: string | null; type: string | null }
        Insert: { id?: string; meta_ar?: string | null; meta_en?: string | null; published_at?: string | null; title_ar?: string | null; title_en?: string | null; type?: string | null }
        Update: { id?: string; meta_ar?: string | null; meta_en?: string | null; published_at?: string | null; title_ar?: string | null; title_en?: string | null; type?: string | null }
        Relationships: []
      }
      schedule_entries: {
        Row: { color: string | null; course_code: string; day: number; end_time: string; id: string; instructor_ar: string | null; instructor_en: string | null; profile_id: string; room: string | null; start_time: string; title_ar: string; title_en: string }
        Insert: { color?: string | null; course_code: string; day: number; end_time: string; id?: string; instructor_ar?: string | null; instructor_en?: string | null; profile_id: string; room?: string | null; start_time: string; title_ar: string; title_en: string }
        Update: { color?: string | null; course_code?: string; day?: number; end_time?: string; id?: string; instructor_ar?: string | null; instructor_en?: string | null; profile_id?: string; room?: string | null; start_time?: string; title_ar?: string; title_en?: string }
        Relationships: []
      }
      shuttle_routes: {
        Row: { color: string | null; every_minutes: number | null; from_ar: string | null; from_en: string | null; id: string; name_ar: string | null; name_en: string | null; times: string[] | null; to_ar: string | null; to_en: string | null }
        Insert: { color?: string | null; every_minutes?: number | null; from_ar?: string | null; from_en?: string | null; id?: string; name_ar?: string | null; name_en?: string | null; times?: string[] | null; to_ar?: string | null; to_en?: string | null }
        Update: { color?: string | null; every_minutes?: number | null; from_ar?: string | null; from_en?: string | null; id?: string; name_ar?: string | null; name_en?: string | null; times?: string[] | null; to_ar?: string | null; to_en?: string | null }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      is_conversation_member: { Args: { cid: string }; Returns: boolean }
      my_role: { Args: never; Returns: Database["public"]["Enums"]["user_role"] }
    }
    Enums: {
      user_role: "student" | "teacher" | "advisor" | "student_affairs" | "vendor" | "admin"
    }
    CompositeTypes: { [_ in never]: never }
  }
}


export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {

  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "journal_entries": {
                  Row: {
                    "body": string,"created_at": string,"id": string,"title": string,"updated_at": string,"user_id": string,"week_start": string
                  }
                  Insert: {
                    "body": string,"created_at"?: string,"id"?: string,"title": string,"updated_at"?: string,"user_id": string,"week_start": string
                  }
                  Update: {
                    "body"?: string,"created_at"?: string,"id"?: string,"title"?: string,"updated_at"?: string,"user_id"?: string,"week_start"?: string
                  }
                  Relationships: [

                  ]
                },"learning_mutations": {
                  Row: {
                    "created_at": string,"fingerprint": string,"operation": string,"request_id": string,"response": NonNullable<Json>,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"fingerprint": string,"operation": string,"request_id": string,"response": NonNullable<Json>,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"fingerprint"?: string,"operation"?: string,"request_id"?: string,"response"?: NonNullable<Json>,"user_id"?: string
                  }
                  Relationships: [

                  ]
                },"lesson_progress": {
                  Row: {
                    "completed_at": string | null,"lesson_slug": string,"minutes_spent": number,"status": Database["public"]['Enums']["lesson_status"],"updated_at": string,"user_id": string
                  }
                  Insert: {
                    "completed_at"?: string | null,"lesson_slug": string,"minutes_spent"?: number,"status"?: Database["public"]['Enums']["lesson_status"],"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "completed_at"?: string | null,"lesson_slug"?: string,"minutes_spent"?: number,"status"?: Database["public"]['Enums']["lesson_status"],"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [

                  ]
                },"notes": {
                  Row: {
                    "body": string,"created_at": string,"id": string,"lesson_slug": string | null,"title": string,"updated_at": string,"user_id": string
                  }
                  Insert: {
                    "body": string,"created_at"?: string,"id"?: string,"lesson_slug"?: string | null,"title": string,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "body"?: string,"created_at"?: string,"id"?: string,"lesson_slug"?: string | null,"title"?: string,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [

                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"display_name": string | null,"updated_at": string,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"display_name"?: string | null,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"display_name"?: string | null,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [

                  ]
                },"review_history": {
                  Row: {
                    "answer_text": string,"card_id": string,"ease_factor": number,"id": string,"interval_days": number,"lapses": number,"lesson_slug": string,"rating": Database["public"]['Enums']["review_rating"],"repetitions": number,"reviewed_at": string,"thought_seconds": number,"user_id": string
                  }
                  Insert: {
                    "answer_text"?: string,"card_id": string,"ease_factor": number,"id"?: string,"interval_days": number,"lapses": number,"lesson_slug": string,"rating": Database["public"]['Enums']["review_rating"],"repetitions": number,"reviewed_at"?: string,"thought_seconds"?: number,"user_id": string
                  }
                  Update: {
                    "answer_text"?: string,"card_id"?: string,"ease_factor"?: number,"id"?: string,"interval_days"?: number,"lapses"?: number,"lesson_slug"?: string,"rating"?: Database["public"]['Enums']["review_rating"],"repetitions"?: number,"reviewed_at"?: string,"thought_seconds"?: number,"user_id"?: string
                  }
                  Relationships: [

                  ]
                },"review_state": {
                  Row: {
                    "card_id": string,"due_at": string,"ease_factor": number,"interval_days": number,"lapses": number,"last_reviewed_at": string | null,"leech": boolean,"lesson_slug": string,"repetitions": number,"suspended": boolean,"updated_at": string,"user_id": string
                  }
                  Insert: {
                    "card_id": string,"due_at"?: string,"ease_factor"?: number,"interval_days"?: number,"lapses"?: number,"last_reviewed_at"?: string | null,"leech"?: boolean,"lesson_slug": string,"repetitions"?: number,"suspended"?: boolean,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "card_id"?: string,"due_at"?: string,"ease_factor"?: number,"interval_days"?: number,"lapses"?: number,"last_reviewed_at"?: string | null,"leech"?: boolean,"lesson_slug"?: string,"repetitions"?: number,"suspended"?: boolean,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [

                  ]
                },"study_sessions": {
                  Row: {
                    "created_at": string,"id": string,"lesson_slug": string | null,"minutes": number,"note": string,"studied_at": string,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"lesson_slug"?: string | null,"minutes": number,"note"?: string,"studied_at"?: string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"lesson_slug"?: string | null,"minutes"?: number,"note"?: string,"studied_at"?: string,"user_id"?: string
                  }
                  Relationships: [

                  ]
                },"user_settings": {
                  Row: {
                    "created_at": string,"experience_level": string,"language": string,"onboarding_complete": boolean,"show_completed_lessons": boolean,"target_role": string,"track": string,"updated_at": string,"user_id": string,"weekly_goal_minutes": number
                  }
                  Insert: {
                    "created_at"?: string,"experience_level"?: string,"language"?: string,"onboarding_complete"?: boolean,"show_completed_lessons"?: boolean,"target_role"?: string,"track"?: string,"updated_at"?: string,"user_id": string,"weekly_goal_minutes"?: number
                  }
                  Update: {
                    "created_at"?: string,"experience_level"?: string,"language"?: string,"onboarding_complete"?: boolean,"show_completed_lessons"?: boolean,"target_role"?: string,"track"?: string,"updated_at"?: string,"user_id"?: string,"weekly_goal_minutes"?: number
                  }
                  Relationships: [

                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "answer_review_card":
{ Args: { "p_answer_text"?: string,"p_card_id": string,"p_lesson_slug": string,"p_rating": Database["public"]['Enums']["review_rating"],"p_thought_seconds"?: number }; Returns: {
              "card_id": string,
"due_at": string,
"ease_factor": number,
"interval_days": number,
"lapses": number,
"last_reviewed_at": string | null,
"leech": boolean,
"lesson_slug": string,
"repetitions": number,
"suspended": boolean,
"updated_at": string,
"user_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "review_state"
        isOneToOne: true
        isSetofReturn: false
      } },
"apply_learning_mutation":
{ Args: { "p_operation": string,"p_payload": Json,"p_request_id": string }; Returns: Json
                           },
"export_learning_snapshot":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"record_lesson_progress":
{ Args: { "p_lesson_slug": string,"p_minutes"?: number,"p_status": Database["public"]['Enums']["lesson_status"] }; Returns: {
              "completed_at": string | null,
"lesson_slug": string,
"minutes_spent": number,
"status": Database["public"]['Enums']["lesson_status"],
"updated_at": string,
"user_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "lesson_progress"
        isOneToOne: true
        isSetofReturn: false
      } }
          }
          Enums: {
            "lesson_status": "not_started"|"in_progress"|"completed"|"needs_review","review_rating": "again"|"hard"|"good"|"easy"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {

          }
        },"public": {
          Enums: {
            "lesson_status": ["not_started", "in_progress", "completed", "needs_review"],"review_rating": ["again", "hard", "good", "easy"]
          }
        }
} as const

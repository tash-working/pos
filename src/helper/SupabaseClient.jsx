import React from 'react'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://cqzzxclyijedhihqtqvl.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxenp4Y2x5aWplZGhpaHF0cXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwNTk3MTMsImV4cCI6MjA1MTYzNTcxM30.IwqD921cL08WFUqlM1PVJdJ6ySF7xh4Wc3zv_VdEkvw"

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase

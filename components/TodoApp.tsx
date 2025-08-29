    'use client'

import { useState, useEffect } from 'react'
import { supabase, type Todo } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Edit2, Trash2, LogOut, User } from 'lucide-react'
import { Chatbot } from '@/components/Chatbot'

interface TodoAppProps {
  user: any
  onSignOut: () => void
}

export function TodoApp({ user, onSignOut }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ensureProfile = async () => {
      try {
        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError && fetchError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.name || null,
              }
            ])

          if (insertError) throw insertError
        }
      } catch (error) {
        console.error('Error ensuring profile:', error)
      }
    }

    fetchTodos()
    ensureProfile()
  }, [])

  const ensureProfile = async () => {
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError && fetchError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email!,
              name: user.user_metadata?.name || null,
            }
          ])

        if (insertError) throw insertError
      }
    } catch (error) {
      console.error('Error ensuring profile:', error)
    }
  }

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return

    setLoading(true)
    try {
      console.log('Adding todo for user:', user.id)
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            user_id: user.id,
            title: newTodo.trim(),
          }
        ])
        .select()
        .single()
      
      console.log('Todo insert result:', { data, error })

      if (error) throw error

      setTodos([data, ...todos])
      setNewTodo('')
    } catch (error) {
      console.error('Detailed error adding todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setTodos(todos.map(todo => todo.id === id ? data : todo))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingText(todo.title)
  }

  const saveEdit = async () => {
    if (!editingText.trim() || !editingId) return

    await updateTodo(editingId, { title: editingText.trim() })
    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    onSignOut()
  }

  const completedTodos = todos.filter(todo => todo.completed)
  const activeTodos = todos.filter(todo => !todo.completed)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Add Todo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                className="flex-1"
              />
              <Button onClick={addTodo} disabled={loading || !newTodo.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{activeTodos.length}</div>
              <div className="text-sm text-gray-600">Active Tasks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{completedTodos.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Todos */}
        {activeTodos.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border transition-all hover:shadow-sm"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) =>
                      updateTodo(todo.id, { completed: checked === true })
                    }
                  />
                  
                  {editingId === todo.id ? (
                    <div className="flex-1 flex space-x-2">
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveEdit()
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="sm" onClick={saveEdit}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-900">{todo.title}</span>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(todo)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-600">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border transition-all hover:shadow-sm"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) =>
                      updateTodo(todo.id, { completed: checked === true })
                    }
                  />
                  <span className="flex-1 text-gray-600 line-through">{todo.title}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Chatbot */}
      <Chatbot user={user}/>
    </div>
  )
}
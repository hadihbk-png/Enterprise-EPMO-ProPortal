import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-[60vh] place-items-center">
          <div className="glass-card max-w-lg p-6 text-center">
            <h1 className="text-xl font-semibold text-white">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-300">{this.state.error.message}</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

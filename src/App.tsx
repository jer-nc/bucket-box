
// import './App.css'
import AppLayout from './components/custom/layouts/AppLayout'
import { ThemeProvider } from './components/providers/theme-provider'
import { Toaster } from './components/ui/toaster'
import AppRoutes from './routes/AppRoutes'

function App() {

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppLayout>
          <Toaster />
          <AppRoutes />
        </AppLayout>
      </ThemeProvider>
    </>
  )
}

export default App

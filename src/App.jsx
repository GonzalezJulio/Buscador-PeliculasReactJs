import './App.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect (() => {
      if (isFirstInput.current) {
          isFirstInput.current = search === ''
          return
      }
      if(search === '') { 
          setError ('No se puede buscar una pelicula vacia')
          return
      }
      if (search.match(/^\d+$/)) {
          setError('No se puede buscar un a pelicula con un número')
          return
      }
      if (search.length < 3) {
          setError('La Busqueda debe tener al menos 3 caracteres')
          return
      }

      setError(null)
  }, [search])
  
  return { search, updateSearch, error }
}


function App() {
  const [sort, setSort] = useState(false)
  
  const { search, updateSearch, error } = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })

  const debounceGetMovies = useCallback(
    debounce(search => {
    console.log('search', search)
    getMovies({ search })

  }, 300)
   ,[]
  )
 
  
  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })

  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debounceGetMovies(newSearch)
  }
  
  useEffect(() => {
    console.log('new getMovies recevid')
  }, [getMovies])
  
  return (
    <div className='page'>
      <header>
        <div>
          <h1>Buscador de Peliculas</h1>
          <form className='form' onSubmit={handleSubmit}>
            <input onChange={handleChange} value={search} name='search' placeholder='Busque su Pelicula'/><input type='checkbox' onChange={handleSort} checked={sort} />
            <button type='submit'>Buscar</button>

           </form>
           {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </header>
      <main>
        <Movies movies={movies} />
      </main>
    </div>
    

  )
}

export default App
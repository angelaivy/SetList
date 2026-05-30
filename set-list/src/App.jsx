import { Routes, Route } from 'react-router'
import './App.css'
import SetList from './components/SetList'

function App() {

  // useEffect(() => {
  //   const getItems = async () => {
  //     try {
  //       // change env var
  //       // change to my own stuff 
  //       const res = await fetch(`${API_BASE_URL}/auth/signup`);
  //       const data = await res.json();
  //       setItems(data);
  //     } catch (e) {
  //       setError(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   getItems();
    
  // }, []);

  // const showCreateAccount = () => {
  //   setShowLoginForm(true);
  //   setIsLoading(false);
  // }
  // const login = () => {
  //   setShowLoginForm(true);
  //   setIsLoading(false);
  // }

  return (
    <>
      <Routes>
        <Route path="/" element={ <SetList /> } />
      </Routes>
    </>
  )
}

export default App

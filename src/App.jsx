import { Route, Routes } from 'react-router';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './components/home/Home';
import About from './components/about/About';
import NotFound from './components/not-found/NotFound';
import Catalog from './components/catalog/Catalog';
import RecipeDetails from './components/recipe-details/RecipeDetails';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Account from './components/account/Account';
import { AuthProvider } from './contexts/auth-context';
import { GuestGuard, PrivateGuard } from './components/guards/Guards';

export default function App() {
    return (
        <AuthProvider>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/recipes/:recipeId" element={<RecipeDetails />} />
                    <Route element={<GuestGuard />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route element={<PrivateGuard />}>
                        <Route path="/account" element={<Account />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </AuthProvider>
    );
}

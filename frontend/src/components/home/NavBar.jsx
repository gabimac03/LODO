import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map, Menu, X } from 'lucide-react';

const NavBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Funciones', href: '#features' },
        { name: 'Cómo funciona', href: '#how-it-works' },
    ];

    const isHome = location.pathname === '/';

    if (!isHome) return null;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-8'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div
                    className={`flex items-center justify-between px-6 py-3 rounded-2xl border transition-all duration-300 ${isScrolled
                            ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl'
                            : 'bg-transparent border-transparent'
                        }`}
                >
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white text-xl">L</div>
                        <span className="text-xl font-bold text-white tracking-tight">LODO</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/map')}
                            className="px-5 py-2.5 bg-white text-black rounded-xl font-bold text-sm flex items-center transition-all"
                        >
                            <Map className="w-4 h-4 mr-2" />
                            VER MAPA
                        </motion.button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 px-6 pt-4 pb-8 md:hidden"
                    >
                        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-medium text-zinc-300"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    navigate('/map');
                                }}
                                className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center"
                            >
                                <Map className="w-5 h-5 mr-2" />
                                VER MAPA
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default NavBar;

import { Link, useLocation } from 'react-router-dom';
import { Map, Settings, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function AppHeader({ onSearchChange, searchValue, resultsCount }) {
    const location = useLocation();
    const isAdmin = location.pathname === '/admin';

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                    <Map className="h-6 w-6 text-primary" />
                    <span>LODO Map</span>
                </Link>

                {/* Search (solo en mapa) */}
                {!isAdmin && onSearchChange && (
                    <div className="flex-1 max-w-md mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar organizaciones..."
                                className="pl-10"
                                value={searchValue || ''}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Right section */}
                <div className="flex items-center gap-4">
                    {!isAdmin && resultsCount !== undefined && (
                        <div className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{resultsCount}</span> resultados
                        </div>
                    )}

                    {!isAdmin ? (
                        <Link to="/admin">
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Admin
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/">
                            <Button variant="outline" size="sm">
                                <Map className="h-4 w-4 mr-2" />
                                Mapa
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

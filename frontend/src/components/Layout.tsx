import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from './Player';

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-dark-100 to-black">
          <Outlet />
        </main>
      </div>
      <Player />
    </div>
  );
}

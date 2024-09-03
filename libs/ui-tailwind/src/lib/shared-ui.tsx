import styles from './shared-ui.module.css';

export function SharedUi() {
  return (
    <div className="h-screen space-x-4 space-y-4 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ...">
      <div className="mx-4 backdrop-blur-sm bg-white/30  bg-white pl-4 rounded-lg shadow flex max-w-md min-w-max hover:shadow-md transition-shadow">
        <div className="p-5">
          <h2 className="font-bold text-4xl">Card NAme</h2>
        </div>
      </div>
      <footer className="bg-gray-900 backdrop-blur-xl bg-white/30  text-white p-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Charlava. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default SharedUi;

import { Link } from 'react-router-dom';
import { FaHome, FaFilm } from 'react-icons/fa';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
            <div className="max-w-md">
                {/* 404 Graphic */}
                <div className="text-[#AB8BFF] mb-6">
                    <span className="text-9xl font-bold block">404</span>
                    <span className="text-2xl">Page Not Found</span>
                </div>

                {/* Message */}
                <p className="text-gray-300 mb-8 text-lg">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Navigation Options */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#AB8BFF] hover:bg-[#9c7ae6] rounded-lg font-bold transition-colors"
                    >
                        <FaHome /> Go Home
                    </Link>
                    <Link
                        to="/movies/634649"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
                    >
                        <FaFilm /> Browse Movies
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
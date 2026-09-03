import { Link } from 'react-router-dom'
import ProtectedPageWrapper from '../ProtectedPageWrapper'

const Home = () => {
  return (
    <ProtectedPageWrapper>
      <div className="max-w-[100vw] min-h-[100vh] flex justify-center p-4 md:p-8 lg:p-12">
        <div className="h-fit bg-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-md text-center flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-red-800">Home</h1>

          <div className="flex flex-col gap-4">
            <Link
              to="/images"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              View Unverified Images
            </Link>

            <Link
              to="/games"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              View Games
            </Link>

            <Link
              to="/logout"
              className="mt-2 text-gray-600 hover:text-red-700 font-medium py-2 transition-colors duration-200"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </ProtectedPageWrapper>
  )
}

export default Home

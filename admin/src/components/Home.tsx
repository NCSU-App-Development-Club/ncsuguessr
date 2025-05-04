import ProtectedPageWrapper from '../ProtectedPageWrapper'

const Home = () => {
  return (
    <ProtectedPageWrapper>
      <div className="max-w-[100vw] min-h-[100vh] bg-gradient-to-br from-red-50 to-red-100 flex justify-center p-4 md:p-8 lg:p-12">
        <div className="h-fit bg-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-md text-center flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-red-800">Home</h1>

          <div className="flex flex-col gap-4">
            <a
              href="/images"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              View Unverified Images
            </a>

            <a
              href="/games"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              View Games
            </a>

            <a
              href="/logout"
              className="mt-2 text-gray-600 hover:text-red-700 font-medium py-2 transition-colors duration-200"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </ProtectedPageWrapper>
  )
}

export default Home

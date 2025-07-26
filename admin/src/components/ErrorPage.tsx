import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="max-w-[100vw] min-h-[100vh] flex justify-center p-2 md:p-4 lg:p-5">
      <div className="text-center flex flex-col gap-5">
        <h1 className="text-4xl font-bold">
          Sorry, an unexpected error has occurred
        </h1>
        <h2 className="text-xl">{`${typeof error === 'object' && error !== null && 'data' in error ? error.data : error}`}</h2>
      </div>
    </div>
  )
}

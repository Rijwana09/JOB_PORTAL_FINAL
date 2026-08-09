import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center">

          <h1 className="text-5xl font-bold">
            Something went wrong
          </h1>

          <button
            className="mt-6 rounded bg-blue-600 px-5 py-2 text-white"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>

        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
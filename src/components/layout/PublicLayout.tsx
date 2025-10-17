import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">TeamManager</h3>
              <p className="text-gray-600 text-sm">
                The ultimate team management platform for modern organizations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/features" className="hover:text-primary">Features</a></li>
                <li><a href="/pricing" className="hover:text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-primary">Security</a></li>
                <li><a href="#" className="hover:text-primary">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/about" className="hover:text-primary">About</a></li>
                <li><a href="/contact" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 TeamManager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About FoodDelivery</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">Delivering delicious meals to your doorstep with love and care</p>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Story</h2>
            <div className="mt-4 h-1 w-24 bg-red-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">From Humble Beginnings</h3>
              <p className="text-gray-600 mb-6">
                Founded in 2025, FoodDelivery started as a small family-owned business with a passion for great food and exceptional service. 
                What began as a single restaurant has grown into a leading food delivery platform serving thousands of happy customers.
              </p>
              <p className="text-gray-600">
                Our mission is simple: to connect hungry people with the best local restaurants and deliver delicious meals right to their doors.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Our restaurant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Values</h2>
            <div className="mt-4 h-1 w-24 bg-red-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality Food',
                description: 'We partner with the best local restaurants to bring you high-quality, delicious meals.',
                icon: '🍽️'
              },
              {
                title: 'Fast Delivery',
                description: 'Your food is delivered fresh and hot, right when you want it.',
                icon: '⚡'
              },
              {
                title: 'Customer First',
                description: 'Your satisfaction is our top priority. We go above and beyond to exceed your expectations.',
                icon: '❤️'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Team</h2>
            <div className="mt-4 h-1 w-24 bg-red-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the passionate people behind FoodDelivery who work tirelessly to bring you the best food experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex Johnson',
                role: 'Founder & CEO',
                image: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              {
                name: 'Sarah Williams',
                role: 'Head of Operations',
                image: 'https://randomuser.me/api/portraits/women/44.jpg'
              },
              {
                name: 'Michael Chen',
                role: 'Head Chef',
                image: 'https://randomuser.me/api/portraits/men/22.jpg'
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-red-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600 text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to order delicious food?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers and enjoy the best food delivery experience.</p>
          <Link 
            to="/" 
            className="bg-white text-red-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors inline-block"
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

import "./App.css";
import "./responsive.css";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(faStar, faMinus, faPlus);
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  let subTotal = 0;
  cart.map((meal) => {
    subTotal = subTotal + meal.price * meal.quantity;
  });
  const fetchData = async () => {
    const response = await axios.get(
      "https://site--deliveroo-backend--nhcf6764t4pv.code.run/"
      // "http://localhost:3200/"
    );
    console.log(response.data);
    setData(response.data);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [setCart]);

  const { categories, restaurant } = data;
  return isLoading ? (
    <span>En cours de téléchargement</span>
  ) : (
    <>
      <header>
        <div className="header-top">
          <div className="container">
            <img
              src="/images_deliveroo/deliveroo-logo.svg"
              alt="deliveroo-logo"
            />
          </div>
        </div>
        <div className="header-main container">
          <div className="header-left">
            <h1>{restaurant.name}</h1>
            <p>{restaurant.description}</p>
          </div>
          <div className="header-right">
            <img src={restaurant.picture} alt="deliveroo" />
          </div>
        </div>
      </header>
      <main className="container">
        <div className="sections">
          {categories.map((category, index) => {
            return (
              category.meals.length > 0 && (
                <section key={category.name}>
                  <h2>{category.name}</h2>

                  <div className="meals">
                    {category.meals.map((meal) => {
                      return (
                        <div
                          key={meal.id}
                          className="meal"
                          onClick={() => {
                            let isInCart = false;
                            const newCart = [...cart];
                            let newtotal = 0;
                            newCart.map((article) => {
                              if (article.id.includes(meal.id)) {
                                article.quantity = article.quantity + 1;
                                isInCart = true;
                              }
                            });
                            if (!isInCart) {
                              const newMeal = {
                                title: meal.title,
                                quantity: 1,
                                price: meal.price,
                                id: meal.id,
                              };
                              newCart.push(newMeal);
                            }
                            setCart(newCart);
                          }}
                        >
                          <div className="meal-desc">
                            <h3>{meal.title}</h3>
                            <p>{meal.description}</p>
                            <div className="meal-footer">
                              <span>{`${meal.price} €`}</span>
                              {meal.popular && (
                                <>
                                  <FontAwesomeIcon
                                    icon="fa-solid fa-star"
                                    style={{ color: "#FF8000" }}
                                  />
                                  <span
                                    style={{
                                      marginLeft: "5px",
                                      color: "#FF8000",
                                    }}
                                  >
                                    Populaire
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          {meal.picture && (
                            <div className="meal-pic">
                              <img src={meal.picture} alt="" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )
            );
          })}
        </div>
        <div className="panier">
          <button
            style={{
              backgroundColor: cart.length === 0 ? "#bac3c3" : "#00CCBC",
              color: cart.length === 0 ? "#868a8a" : "#ffffff",
            }}
          >
            Valider mon panier
          </button>
          {cart.length === 0 ? (
            <p>Votre panier est vide</p>
          ) : (
            <div>
              <div className="panier-content">
                {cart.map(({ title, quantity, price, id }, index) => {
                  return (
                    <div className="panier-article" key={id}>
                      <div className="quantity">
                        <div
                          className="qtityButton"
                          onClick={() => {
                            const newCart = [...cart];
                            newCart[index].quantity = quantity - 1;

                            let newtotal = 0;
                            if (newCart[index].quantity === 0) {
                              newCart.splice(index, 1);
                            }
                            setCart(newCart);
                          }}
                        >
                          <FontAwesomeIcon
                            icon="fa-solid fa-minus"
                            size="2xs"
                            style={{ color: "#00ccbc" }}
                          />
                        </div>
                        <span>{quantity}</span>
                        <div
                          className="qtityButton"
                          onClick={() => {
                            const newCart = [...cart];
                            newCart[index].quantity = quantity + 1;
                            let newtotal = 0;
                            setCart(newCart);
                          }}
                        >
                          <FontAwesomeIcon
                            icon="fa-solid fa-plus"
                            size="2xs"
                            style={{ color: "#00ccbc" }}
                          />
                        </div>
                      </div>
                      <div className="order-details">
                        <p>{title}</p>
                        <span>{(quantity * price).toFixed(2)} €</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="panier-bottom">
                <div className="panier-bottom-line">
                  <p>Sous-total</p>
                  <span>{subTotal.toFixed(2)} €</span>
                </div>
                <div className="panier-bottom-line">
                  <p>Frais de livraison</p>
                  <span>2.5 €</span>
                </div>
                <div className="panier-bottom-line">
                  <p>Total</p>
                  <span>{(subTotal + 2.5).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;

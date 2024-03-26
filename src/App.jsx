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
  const [basketContent, setBasketContent] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3200/");
      console.log(response.data);
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, [setBasketContent]);

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
              index < categories.length / 2 && (
                // !(category.meals === {}}) && (
                <section key={category.name}>
                  <h2>{category.name}</h2>

                  <div className="meals">
                    {category.meals.map((meal) => {
                      return (
                        <div
                          key={meal.id}
                          className="meal"
                          onClick={() => {
                            let isInBasket = false;
                            const newBasketContent = [...basketContent];
                            let newtotal = 0;
                            newBasketContent.map((article) => {
                              if (article.id.includes(meal.id)) {
                                article.quantity = article.quantity + 1;
                                isInBasket = true;
                              }
                              newtotal =
                                newtotal + article.quantity * article.price;
                            });
                            if (!isInBasket) {
                              const newMeal = {
                                title: meal.title,
                                quantity: 1,
                                price: meal.price,
                                id: meal.id,
                              };
                              newtotal =
                                newtotal + newMeal.quantity * newMeal.price;
                              newBasketContent.push(newMeal);
                            }
                            setSubTotal(newtotal);
                            setBasketContent(newBasketContent);
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
        <div
          className="panier"
          // style={{ height: basketContent.length === 0 ? "150px" : "auto" }}
        >
          <button
            style={{
              backgroundColor:
                basketContent.length === 0 ? "#bac3c3" : "#00CCBC",
              color: basketContent.length === 0 ? "#868a8a" : "#ffffff",
            }}
          >
            Valider mon panier
          </button>
          {basketContent.length === 0 ? (
            <p>Votre panier est vide</p>
          ) : (
            <div>
              <div className="panier-content">
                {basketContent.map(({ title, quantity, price, id }, index) => {
                  return (
                    <div className="panier-article" key={id}>
                      <div className="quantity">
                        <div
                          className="qtityButton"
                          onClick={() => {
                            const newBasketContent = [...basketContent];
                            newBasketContent[index].quantity = quantity - 1;

                            let newtotal = 0;
                            newBasketContent.map((article) => {
                              newtotal =
                                newtotal + article.quantity * article.price;
                            });
                            setSubTotal(newtotal);
                            if (newBasketContent[index].quantity === 0) {
                              newBasketContent.splice(index, 1);
                            }
                            setBasketContent(newBasketContent);
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
                            const newBasketContent = [...basketContent];
                            newBasketContent[index].quantity = quantity + 1;
                            let newtotal = 0;
                            newBasketContent.map((article) => {
                              newtotal =
                                newtotal + article.quantity * article.price;
                            });
                            setSubTotal(newtotal);
                            setBasketContent(newBasketContent);
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

import "./App.css";
import "./responsive.css";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(faStar);
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3200/");
      console.log(response.data);
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);
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
                <section>
                  <h2>{category.name}</h2>

                  <div className="meals">
                    {category.meals.map((meal) => {
                      return (
                        <div className="meal">
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
          <button>Valider mon panier</button>
          <div className="panier-content">
            <p>Votre panier est vide</p>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;

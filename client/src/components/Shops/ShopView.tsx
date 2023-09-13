import React from "react";
import ShopCard from "./ShopCard";
import classes from "./ShopView.module.scss";

const ShopView = ({ shops, handleNavigationToDetails }: any) => {
  return (
    <div className={classes.shops__container}>
      <div>
        <h4>{shops.length} намерени места във вашата зона</h4>
      </div>
      <div>
        {shops.map((shop: any) => (
          <ShopCard
            key={shop._id}
            shop={shop}
            handleNavigationToDetails={handleNavigationToDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopView;

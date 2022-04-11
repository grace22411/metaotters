// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
    isWhitelisted: true
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (addr) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      let whiteList = await store
        .getState()
        .blockchain.smartContract.methods.isWhitelisted(addr)
        .call();
        let getunitPrice = await store
        .getState()
        .blockchain.smartContract.methods.getunitPrice()
        .call();

      dispatch(
        fetchDataSuccess({
          whiteList,
          totalSupply,
          getunitPrice
          
          // cost,
        })
      );

     console.log(getunitPrice)
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};

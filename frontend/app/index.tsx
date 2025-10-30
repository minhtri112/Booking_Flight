import Navigation from "./navigation/index";
import { Provider } from "react-redux";
import { store } from "./redux/store";
export default function Index() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

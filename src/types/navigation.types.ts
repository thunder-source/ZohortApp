import type {StackNavigationProp} from '@react-navigation/stack';
import type {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: {productId: number};
};

export type ProductListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

export type ProductDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductDetail'
>;

export type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetail'
>;


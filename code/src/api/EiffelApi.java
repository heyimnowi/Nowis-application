package api;

import java.lang.reflect.Type;
import java.util.List;

import model.*;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

class EiffelApi implements HciApi {

	// General constants

	// TODO add extra method definitions here

	// Method Domains
	private static final String COMMON = "Common.groovy";
	private static final String ACCOUNT = "Account.groovy";
	private static final String CATALOG = "Catalog.groovy";
	private static final String ORDER = "Order.groovy";

	// Methods
	private static final Method GET_ATTRIBUTES = new Method(COMMON, "GetAllAttributes");
	private static final Method GET_ATTRIBUTE_BY_ID = new Method(COMMON, "GetAttributeById");
	private static final Method SIGN_IN = new Method(ACCOUNT, "SignIn");
	private static final Method GET_ALL_SUBCATEGORIES = new Method(CATALOG,"GetAllSubcategories");
	private static final Method GET_PRODUCTS_BY_SUBCAT_ID = new Method(CATALOG,"GetProductsBySubcategoryId");
	private static final Method GET_ALL_ORDERS = new Method(ORDER, "GetAllOrders");
	private static final Method GET_PRODUCTS_BY_NAME= new Method(CATALOG, "GetProductsByName");
	private static final Method GET_PRODUCT_BY_ID= new Method(CATALOG, "GetProductById");
	private static final Method GET_ORDER_BY_ID = new Method(CATALOG, "GetOrderById");

	// OutputParamNames
	private static final String LIMIT_FIELD_ATTRIBUTES = "attributes";
	private static final String LIMIT_FIELD_ATTRIBUTE = "attribute";
	private static final String LIMIT_FIELD_SUBCATEGORIES = "subcategories";
	private static final String LIMIT_FIELD_PRODUCT_LIST = "products";
	private static final String LIMIT_FIELD_PRODUCT = "product";

	@Override
	public void getAttributes(ApiCallback<List<ProductAttribute>> callback) {
		Type t = new TypeToken<List<ProductAttribute>>() {}.getType();
		new ApiCallTask.Builder<List<ProductAttribute>>().setCallback(callback)
				.setType(t).setMethod(GET_ATTRIBUTES)
				.setLimitField(LIMIT_FIELD_ATTRIBUTES).build().execute();
	}

	@Override
	public void getAttributeById(long id, ApiCallback<ProductAttribute> callback) {
		Type t = new TypeToken<ProductAttribute>() {}.getType();
		new ApiCallTask.Builder<ProductAttribute>().setCallback(callback)
				.setType(t).setMethod(GET_ATTRIBUTE_BY_ID)
				.setLimitField(LIMIT_FIELD_ATTRIBUTE)
				.addParam("id", String.valueOf(id)).build().execute();
	}

	@Override
	public void signIn(String username, String password,
			ApiCallback<SignInResult> callback) {
		Type t = new TypeToken<SignInResult>(){}.getType();
		new ApiCallTask.Builder<SignInResult>().setCallback(callback)
				.setType(t).setMethod(SIGN_IN).addParam("username", username)
				.addParam("password", password).build().execute();
	}

	// TODO add extra api calls here
	
	@Override
	public void getAllSubcategories(long id, List<Filter> filter, ApiCallback<List<Subcategory>> callback) {
		Type t = new TypeToken<List<Subcategory>>() {}.getType();
		String result= new Gson().toJson(filter);
		new ApiCallTask.Builder<List<Subcategory>>().setCallback(callback)
				.setType(t).setMethod(GET_ALL_SUBCATEGORIES)
				.setLimitField(LIMIT_FIELD_SUBCATEGORIES).addParam("id", String.valueOf(id))
				.addParam("filters", result).build().execute();
	}
	
	@Override
	public void getProductsBySubcategoryId(long id, int page, List<Filter> filter, ApiCallback<ApiResponse> callback){
		Type t = new TypeToken<ApiResponse>() {}.getType();
		String result= new Gson().toJson(filter);
		new ApiCallTask.Builder<ApiResponse>().setCallback(callback)
				.setType(t).setMethod(GET_PRODUCTS_BY_SUBCAT_ID)
				.addParam("id", String.valueOf(id)).addParam("page", String.valueOf(page))
				.addParam("filters", result).build().execute();
	}
	
	@Override
	public void getAllOrders(String username, String authentication_token, ApiCallback<Orders> callback) {
		Type t = new TypeToken<Orders>() {}.getType();
		new ApiCallTask.Builder<Orders>()
			.setCallback(callback)
			.setType(t).setMethod(GET_ALL_ORDERS).addParam("username", username)
			.addParam("authentication_token", authentication_token).build().execute();
	}

	@Override
	public void getProductsByName(String query, ApiCallback<ApiResponse> callback) {
		Type t = new TypeToken<ApiResponse>() {}.getType();
		new ApiCallTask.Builder<ApiResponse>()
			.setCallback(callback)
			.setType(t).setMethod(GET_PRODUCTS_BY_NAME)
			.addParam("name", query).build().execute();
	}

	@Override
	public void getProductById(long id, ApiCallback<Product> callback) {
		Type t = new TypeToken<Product>() {}.getType();
		new ApiCallTask.Builder<Product>()
			.setCallback(callback)
			.setType(t).setMethod(GET_PRODUCT_BY_ID).setLimitField(LIMIT_FIELD_PRODUCT)
			.addParam("id", String.valueOf(id)).build().execute();
	}
	
	public void getOrderById(String username, String authenticationToken, ApiCallback<Order> callback) {
		Type t = new TypeToken<Order>() {}.getType();
		new ApiCallTask.Builder<Order>()
			.setCallback(callback)
			.setType(t).setMethod(GET_ORDER_BY_ID).addParam("username", username)
			.addParam("authentication_token", authenticationToken)
			.setLimitField(LIMIT_FIELD_PRODUCT_LIST)
			.build().execute();
	}
}

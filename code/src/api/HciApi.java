package api;

import java.util.List;

import model.ApiResponse;
import model.Filter;
import model.Order;
import model.Product;
import model.Orders;
import model.Product;
import model.ProductAttribute;
import model.SignInResult;
import model.Subcategory;

public interface HciApi {

	/**
	 * Returns the list of available attributes.
	 * 
	 * @param callback
	 *            The callback that will be invoked upon success or error.
	 */
	public void getAttributes(ApiCallback<List<ProductAttribute>> callback);

	/**
	 * Returns a specific attribute.
	 * 
	 * @param id
	 *            The id of the attribute
	 * @param callback
	 *            The callback that will be invoked upon success or error.
	 */
	public void getAttributeById(long id, ApiCallback<ProductAttribute> callback);

	/**
	 * Signs the user in.
	 * 
	 * @param username
	 *            The username of the user
	 * @param password
	 *            The password of the user
	 * @param callback
	 *            The callback that will be invoked upon success or error.
	 */
	public void signIn(String username, String password,
			ApiCallback<SignInResult> callback);
	
	public void getAllSubcategories(long id, List<Filter> filter, 
			ApiCallback<List<Subcategory>> callback);

	public void getProductsBySubcategoryId(long id, int page, List<Filter> filter, 
			ApiCallback<ApiResponse> callback);

	public void getAllOrders(String username, String authentication_token,
			ApiCallback<Orders> callback);
	
	public void getProductsByName(String query, ApiCallback<ApiResponse> apiCallback);
	
	public void getProductById(long id, ApiCallback<Product> callback);

	public void getOrderById(String username, String authenticationToken,
			ApiCallback<Order> callback);
}

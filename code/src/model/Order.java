package model;

public class Order implements Comparable{
	
	private Integer id;
	private Address address;
	private CreditCard creditCard;
	private String status;
	private String receivedDate;
	private String processedDate;
	private String shippedDate;
	private String deliveredDate;
	private String latitude;
	private String longitude;
	
	public Order(Integer id, Address address, CreditCard creditCard,
			String status, String receivedDate, String processedDate,
			String shippedDate, String deliveredDate, String latitude,
			String longitude) {
		super();
		this.id = id;
		this.address = address;
		this.creditCard = creditCard;
		this.status = status;
		this.receivedDate = receivedDate;
		this.processedDate = processedDate;
		this.shippedDate = shippedDate;
		this.deliveredDate = deliveredDate;
		this.latitude = latitude;
		this.longitude = longitude;
	}

	public Integer getId() {
		return id;
	}

	public Address getAddress() {
		return address;
	}

	public CreditCard getCreditCard() {
		return creditCard;
	}

	public String getStatus() {
		return status;
	}

	public String getReceivedDate() {
		return receivedDate;
	}

	public String getProcessedDate() {
		return processedDate;
	}

	public String getShippedDate() {
		return shippedDate;
	}

	public String getDeliveredDate() {
		return deliveredDate;
	}

	public String getLatitude() {
		return latitude;
	}

	public String getLongitude() {
		return longitude;
	}

	@Override
	public int compareTo(Object another) {
		int answ;
		if (this.id < ((Order)another).id){
			answ = 1;
		}else if(this.id > ((Order)another).id){
			answ = -1;
		}else{
			answ = 0;
		}
		return answ;
	}

}

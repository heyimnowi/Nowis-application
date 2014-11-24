package model;

public class Meta {

	private String uuid;
	private String time;
	
	Meta() { };

	public Meta(String uuid, String time) {
		super();
		this.uuid = uuid;
		this.time = time;
	}

	public String getUuid() {
		return uuid;
	}

	public String getTime() {
		return time;
	}
}

package kr.or.ih.api.entity;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("User")
public class User
{
	private int user_id=1;
	private String user_username="admin";
	private String user_password="1234";
	private int user_status=1;
	private int user_type=0;
	private String create_date="2021-12-01 22:05:34";
	private String modify_date="2021-12-01 22:05:34";
}


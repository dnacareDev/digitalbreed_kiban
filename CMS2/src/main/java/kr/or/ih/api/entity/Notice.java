package kr.or.ih.api.entity;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("Notice")
public class Notice
{
	private int notice_id;
	private int outcome_id;
	private int notice_type;
	private String create_date;
	private String modify_date;
	
	private String user_username;
	private int marker_id;
	private int outcome_type;
	private int outcome_status;
	private String outcome_comment;
}
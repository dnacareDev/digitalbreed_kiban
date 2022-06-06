package kr.or.ih.api.entity;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("Marker")
public class Marker
{
	private int marker_id;
	private String marker_crop;
	private String marker_version;
	private String marker_contents;
	private String marker_credit;
	private int marker_status;
	private String create_date;
	private String modify_date;
	
	private int marker_file_id;
	private String marker_file;
	private int marker_file_type;
}
package kr.or.ih.api.entity;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("Pagination")
public class Pagination
{
	private int count;
	private int page_num;
	private int start_page;
	private int end_page;
	private int offset;
	private int limit;
}
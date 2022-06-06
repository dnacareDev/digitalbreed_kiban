package kr.or.ih.api.entity;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("Counts")
public class Counts
{
	private String user_username;
	private int user_status;
	
	private int map;
	private int poly;
	private int mabc;
	private int phylogeny;
	private int spec;
	private int qtl;
	private int ngs;
	private int snp;
	private int userresult;
	
	private int total_file;
	private int download_file;
	private int raw_file;
}
package kr.or.ih.api.entity;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("MarkerFile")
public class MarkerFile
{
	private int marker_file_id;
	private int marker_id;
	private int marker_file_type;				// 파일 유형(0: fasta, 1: length, 2: gff, 3: marker)
	private String marker_file;
	private String marker_origin_file;
}
package kr.or.ih.api.entity;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("Outcome")
public class Outcome
{
	private int outcome_id;
	private String user_username;
	private int outcome_type;						// 결과 유형(0: 염색체 시각화, 1: 마커 맵, 2: 다형성 마커, 3: MABC, 4: 유사도 분석, 5: 계통구분용, 6: QTL, 7: NGS, 8: SNP)
	private int outcome_status;
	private String outcome_comment;
	private String outcome_file;
	private String outcome_origin_file;
	private int outcome_file_status;
	private String outcome_result;
	private String create_date;
	private String modify_date;
	
	private int marker_id;
	private String marker_crop;
	private String marker_version;
	private String marker_credit;
	
	private int marker_file_id;
	private int marker_file_type;
	private String marker_file;
	private String marker_origin_file;
}
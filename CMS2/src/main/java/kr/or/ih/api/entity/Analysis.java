package kr.or.ih.api.entity;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias("Analysis")
public class Analysis
{
	private int analysis_id;
	private String user_username;
	private int analysis_type;				// (0: 염색체 시각화, 1: 마커 맵, 2: 다형성 마커, 3: MABC, 4: 유사도 분석, 5: 계통구분용, 6: QTL, 7: NGS, 8: SNP)
	private String create_date;
	private String modify_date;
}
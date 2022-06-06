package kr.or.ih.api.service.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.RequestParam;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Outcome;

@Mapper
public interface SnpMapper
{
	
	int SelectOutcomeCount(String user_username);
	
	List<Outcome> SelectOutcomeList(@Param("user_username") String user_username, @Param("offset") int offset, @Param("limit") int limit);
	
	// 작물 조회
	List<Crop> SelectCrop();

	String SelectMarkerFileName(int marker_id);
	
	Outcome SelectOutcome(int outcome_id);
}
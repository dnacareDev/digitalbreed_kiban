package kr.or.ih.api.service.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;

@Mapper
public interface SpecificmakerMapper
{
	
	int SelectOutcomeCount(String user_username);
	
	List<Outcome> SelectOutcomeList(@Param("user_username") String user_username, @Param("offset") int offset, @Param("limit") int limit);

	List<Outcome> SelectOutcomeDetail(int outcome_id);
	
	List<Marker> SelectMarker(int marker_id);

	Outcome SelectOutcome(int outcome_id);

	// 버전 정보 조회
	List<Marker> SelectMarkerFile(int marker_id);

	List<Crop> SelectCrop();
}
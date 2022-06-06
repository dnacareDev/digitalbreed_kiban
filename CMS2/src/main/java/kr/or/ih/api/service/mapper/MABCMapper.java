package kr.or.ih.api.service.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.MarkerFile;
import kr.or.ih.api.entity.Outcome;

@Mapper
public interface MABCMapper
{

	int SelectOutcomeCount(String user_username);
	
	List<Outcome> SelectOutcomeList(@Param("user_username") String user_username, @Param("offset") int offset, @Param("limit") int limit);

	Outcome SelectMABCDetail(int outcome_id);

	Marker SelectMarkerFile(int marker_id);

	String SelectOutcomeResult(int outcome_id);

	List<Crop> SelectCrop();
}
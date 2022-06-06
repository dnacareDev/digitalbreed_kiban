package kr.or.ih.api.service.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;

@Mapper
public interface IndexMapper
{
	List<Marker> SelectMarkerList();

	List<Outcome> SelectOutcomeList(@Param("user_username") String user_username, @Param("type") int type);

	int UpdateOutcomeFileStatus(int outcome_id);

	int InsertAnalysis(@Param("user_username") String user_username, @Param("type") int type);
}
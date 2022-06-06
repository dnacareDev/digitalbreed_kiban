package kr.or.ih.api.service.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.ih.api.entity.Marker;

@Mapper
public interface KaryotypeMapper
{
	
	int SelectMarkerCount();

	List<Marker> SelectMarkerList(@Param("offset") int offset, @Param("limit") int limit);

	List<Marker> SelectMarkerDetail(int marker_id);
}